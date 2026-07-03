import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}          <Link key={c.id} href={`/portal/cases/${c.id}`} className="group">
            
            <Card className="relative overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-primary/40">

              {/* subtle brand glow line */}
              <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary/80 via-accent to-transparent opacity-70" />

              <CardContent className="space-y-5 p-6">

                {/* TITLE */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                      {c.title}
                    </p>
                    <StatusBadge {...STATUS_META[c.status]} />
                  </div>

                  <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                    {c.reference}
                  </p>
                </div>

                {/* PROGRESS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">
                      {c.progress}%
                    </span>
                  </div>

                  <Progress value={c.progress} className="h-1.5" />
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-2 text-xs">

                  <div className="flex items-center gap-2">
                    <StatusBadge {...PRIORITY_META[c.priority]} />

                    <span className="text-muted-foreground">
                      Due {formatDate(c.dueDate)}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 font-medium text-primary opacity-80 group-hover:opacity-100">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>

                </div>

              </CardContent>
            </Card>

          </Link>
        ))}

      </div>
    </div>
  )
}
