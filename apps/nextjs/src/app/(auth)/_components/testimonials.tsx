import type { FC, SVGProps } from "react"

import * as Avatar from "@acme/ui/avatar"
import * as Carousel from "@acme/ui/carousel"

export type Testimonial = {
  id: number
  text: string
  user: {
    name: string
    avatarUrl: string
    position: string
  }
  company: {
    name: string
    Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element
  }
}
/**
 * Extracts and returns the initials from the provided full name.
 */
const getInitials = (name: string) => `${name.split(" ")[0]?.charAt(0)}${name.split(" ")[1]?.charAt(0)}`

type Props = {
  testimonials: Testimonial[]
}

const Testimonials: FC<Props> = ({ testimonials }) => {
  return (
    <Carousel.Root
      opts={{
        align: "start",
      }}
      className="flex w-full flex-col items-center"
    >
      <Carousel.Content>
        {testimonials.map((testimonial) => (
          <Carousel.Item key={testimonial.id}>
            <TestimonialItem key={testimonial.id} testimonial={testimonial} />
          </Carousel.Item>
        ))}
      </Carousel.Content>

      <Carousel.Indicators className="mt-12" />
    </Carousel.Root>
  )
}

const TestimonialItem: FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <figure className="mx-auto flex max-w-4xl flex-col items-center gap-8 select-none sm:gap-10">
      <testimonial.company.Icon className="h-8 w-fit" />
      <p className="text-center text-lg sm:text-2xl">{testimonial.text}</p>

      <div className="flex flex-col items-center gap-2">
        <Avatar.Root size="xl">
          <Avatar.Image src={testimonial.user.avatarUrl} alt={testimonial.user.name} />
          <Avatar.TextFallback>{getInitials(testimonial.user.name)}</Avatar.TextFallback>
        </Avatar.Root>
        <div className="text-center">
          <p className="text-base font-medium text-neutral-700">{testimonial.user.name}</p>
          <p className="text-base text-neutral-500">{testimonial.user.position}</p>
        </div>
      </div>
    </figure>
  )
}

export default Testimonials
