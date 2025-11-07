const express = require('express')
const router = express.Router()
const db = require('../db')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const {authenticate} = require('../middleware/auth')

// create checkout session
router.post('/:id/enroll', authenticate, async (req, res) => {
	const courseId = req.params.id
	const userId = req.user.id
	const q = await db.query('SELECT * FROM courses WHERE id=$1', [courseId])
	const course = q.rows[0]
	if (!course) return res.status(404).json({error: 'Course not found'})
	
	if ((course.price_cents || 0) === 0) {
		await db.query('INSERT INTO enrollments(user_id,course_id,paid) VALUES($1,$2,$3) ON CONFLICT(user_id,course_id) DO NOTHING', [userId, courseId, true])
		return res.json({ok: true, message: 'Enrolled (free)'})
	}
	
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: [{
				price_data: {
					currency: 'usd',
					unit_amount: course.price_cents * 100,
					product_data: {name: course.title}
				},
				quantity: 1
			}],
			success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}`,
			metadata: {course_id: String(courseId), user_id: String(userId)}
		})
		
		await db.query('INSERT INTO enrollments(user_id,course_id,paid,stripe_payment_intent) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,course_id) DO UPDATE SET stripe_payment_intent=$4', [userId, courseId, false, session.id])
		
		res.status(201).json({url: session.url})
	} catch (err) {
		console.error(err)
		res.status(500).json({error: 'Stripe error'})
	}
})

// confirm endpoint (used after redirect)
router.get('/confirm', async (req, res) => {
	const sessionId = req.query.session_id
	if (!sessionId) return res.status(400).json({ error: 'session_id required' })
	
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['payment_intent']
		})
		
		const paid =
			session.payment_status === 'paid' ||
			session.payment_intent?.status === 'succeeded'
		
		const metadata = session.metadata || {}
		const courseId = parseInt(metadata.course_id)
		const userId = parseInt(metadata.user_id)
		
		if (!paid) {
			return res.status(400).json({ error: 'Payment not completed' })
		}
		
		// 🔑 faqat ID saqlaymiz
		const paymentId =
			typeof session.payment_intent === 'object'
				? session.payment_intent.id
				: session.payment_intent || session.id
		
		const amount = session.amount_total || null
		const currency = session.currency || null
		
		await db.query(
			'UPDATE enrollments SET paid=true, stripe_payment_intent=$1 WHERE user_id=$2 AND course_id=$3',
			[paymentId, userId, courseId]
		)
		
		await db.query(
			'INSERT INTO payments(user_id,course_id,stripe_payment_id,amount_cents,currency,status) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (stripe_payment_id) DO NOTHING',
			[userId, courseId, paymentId, amount, currency, 'succeeded']
		)
		
		res
			.status(200)
			.json({ ok: true, message: 'Payment confirmed and enrollment updated', courseId })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error confirming payment' })
	}
})


module.exports = router