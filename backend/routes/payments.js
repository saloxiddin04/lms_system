const express = require('express')
const router = express.Router()
const db = require('../db')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const {authenticate} = require('../middleware/auth')

router.post('/:id/enroll', authenticate, async (req, res) => {
	const courseId = req.params.id
	const userId = req.user.id
	
	const q = await db.query('SELECT * FROM courses WHERE id=$1', [courseId])
	const course = q.rows[0]
	if (!course) return res.status(404).json({error: 'Course not found'})
	
	const existingEnroll = await db.query(
		'SELECT paid, stripe_payment_intent FROM enrollments WHERE user_id=$1 AND course_id=$2',
		[userId, courseId]
	)
	
	if (existingEnroll.rows.length > 0 && existingEnroll.rows[0].paid === true) {
		return res.status(400).json({
			error: 'Already enrolled and paid',
			alreadyPaid: true,
			courseId,
			redirectUrl: `/courses/${courseId}/learn`
		})
	}
	
	console.log('Kurs narxi:', course.price_cents, 'Kurs:', course.title)
	
	if ((Number(course.price_cents) || 0) === 0) {
		console.log("Free kurs - enroll qilish")
		if (existingEnroll.rows.length > 0) {
			await db.query(
				`UPDATE enrollments
                 SET paid=true, enrolled_at=NOW()
                 WHERE user_id=$1 AND course_id=$2`,
				[userId, courseId]
			)
		} else {
			await db.query(
				`INSERT INTO enrollments(user_id, course_id, paid)
                 VALUES($1, $2, $3)`,
				[userId, courseId, true]
			)
		}
		
		return res.json({
			ok: true,
			message: 'Enrolled (free)',
			courseId,
			redirectUrl: `/courses/${courseId}/learn`
		})
	}
	
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: [{
				price_data: {
					currency: 'usd',
					unit_amount: Number(course.price_cents) * 100,
					product_data: {
						name: course.title,
						description: course.description?.substring(0, 100) || 'Online course enrollment'
					}
				},
				quantity: 1
			}],
			success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
			cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}?canceled=true`,
			metadata: {
				course_id: String(courseId),
				user_id: String(userId)
			},
			expires_at: Math.floor(Date.now() / 1000) + 30 * 60
		})
		
		if (existingEnroll.rows.length > 0) {
			await db.query(
				`UPDATE enrollments
                 SET stripe_payment_intent=$1, enrolled_at=NOW()
                 WHERE user_id=$2 AND course_id=$3`,
				[session.id, userId, courseId]
			)
			console.log('Mavjud enroll yangilandi (paid: false)')
		} else {
			// Yangi enroll yaratish (paid: false)
			await db.query(
				`INSERT INTO enrollments(user_id, course_id, paid, stripe_payment_intent)
                 VALUES($1, $2, $3, $4)`,
				[userId, courseId, false, session.id]
			)
			console.log('Yangi enroll yaratildi (paid: false)')
		}
		
		res.status(201).json({
			url: session.url,
			sessionId: session.id,
			courseId,
			message: 'Payment session created',
			existingEnroll: existingEnroll.rows.length > 0
		})
		
	} catch (err) {
		console.error('Stripe xatosi:', err.message)
		res.status(500).json({error: 'Payment system error: ' + err.message})
	}
})

router.get('/confirm', async (req, res) => {
	const sessionId = req.query.session_id
	console.log('🔵 Confirm chaqirildi:', sessionId)
	
	if (!sessionId) return res.status(400).json({ error: 'session_id required' })
	
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['payment_intent']
		})
		
		console.log('📊 Session ma\'lumotlari:', {
			id: session.id,
			status: session.status,
			payment_status: session.payment_status,
			amount_total: session.amount_total,
			currency: session.currency,
			metadata: session.metadata
		})
		
		const paid = session.payment_status === 'paid' || session.payment_intent?.status === 'succeeded'
		
		if (!paid) {
			console.log('❌ To\'lov amalga oshmagan:', session.payment_status)
			return res.status(400).json({
				error: 'Payment not completed',
				status: session.payment_status,
				sessionStatus: session.status
			})
		}
		
		const metadata = session.metadata || {}
		const courseId = parseInt(metadata.course_id) || 0
		const userId = parseInt(metadata.user_id) || 0
		
		if (!courseId || !userId) {
			return res.status(400).json({ error: 'Invalid metadata in session' })
		}
		
		const paymentId = session.payment_intent?.id || session.id
		
		const updateResult = await db.query(
			`UPDATE enrollments
			 SET paid=true, stripe_payment_intent=$1, enrolled_at=NOW()
			 WHERE user_id=$2 AND course_id=$3
			 RETURNING id`,
			[paymentId, userId, courseId]
		)
		
		if (updateResult.rowCount === 0) {
			console.log('⚠️ Enrollments topilmadi, yangi yozuv yaratilmoqda...')
			await db.query(
				`INSERT INTO enrollments(user_id, course_id, paid, stripe_payment_intent)
				 VALUES($1, $2, true, $3)`,
				[userId, courseId, paymentId]
			)
		}
		
		await db.query(
			`INSERT INTO payments(user_id, course_id, stripe_payment_id, amount_cents, currency, status)
			 VALUES($1, $2, $3, $4, $5, $6)
			 ON CONFLICT (stripe_payment_id)
			 DO UPDATE SET status=$6, created_at=NOW()`,
			[userId, courseId, paymentId, session.amount_total, session.currency, 'succeeded']
		)
		
		console.log('✅ To\'lov tasdiqlandi:', { userId, courseId, paymentId })
		
		res.status(200).json({
			ok: true,
			message: 'Payment confirmed and enrollment updated',
			courseId,
			userId,
			paymentId,
			amount: session.amount_total / 100,
			currency: session.currency.toUpperCase(),
			redirectUrl: `/courses/${courseId}/learn`
		})
		
	} catch (err) {
		console.error('❌ Confirm xatosi:', err)
		res.status(500).json({
			error: 'Server error confirming payment',
			details: err.message
		})
	}
})


module.exports = router