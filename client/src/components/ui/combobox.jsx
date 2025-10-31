import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

export default function ComboboxDemo({options, value, onChange}) {
	const [open, setOpen] = React.useState(false)
	
	return (
		<div className="w-full p-6 flex justify-center">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{value
							? options?.find((option) => option.value === value)?.label
							: "Select option..."}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<Command>
						<CommandInput placeholder="Search option..." className="h-9" />
						<CommandList>
							<CommandEmpty>No option found.</CommandEmpty>
							<CommandGroup>
								{options?.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={() => {
											onChange(option?.value === value ? "" : option?.value)
											setOpen(false)
										}}
									>
										{option?.label}
										<Check
											className={cn(
												"ml-auto",
												value === option?.value ? "opacity-100" : "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}