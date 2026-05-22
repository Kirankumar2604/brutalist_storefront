import { HttpTypes } from "@medusajs/types"
import { Badge, Text } from "@modules/common/components/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const isPaymentComplete = [
    "authorized",
    "captured",
    "partially_refunded",
    "refunded",
  ].includes(order.payment_status)

  const isFulfillmentInProgress = [
    "partially_fulfilled",
    "partially_shipped",
  ].includes(order.fulfillment_status)

  const isFulfillmentComplete = ["fulfilled", "shipped"].includes(
    order.fulfillment_status
  )

  const isCanceled =
    order.fulfillment_status === "canceled" || order.payment_status === "canceled"

  const timelineSteps = [
    {
      title: "Placed",
      detail: "Order received",
      state: "done" as const,
    },
    {
      title: "Fulfillment",
      detail: isFulfillmentInProgress
        ? "In progress"
        : "Preparing shipment",
      state: isPaymentComplete ? ("done" as const) : ("current" as const),
    },
    {
      title: "Complete",
      detail: "Ready for delivery",
      state: isPaymentComplete ? ("done" as const) : ("pending" as const),
    },
    {
      title: "Shipped",
      detail: ["shipped", "delivered"].includes(order.fulfillment_status) ? "dispatched" : "In transit",
      state: ["shipped", "delivered"].includes(order.fulfillment_status) ? ("done" as const) : ("pending" as const),
    },
    {
      title: "Delivered",
      detail: order.fulfillment_status === "delivered" ? "successfully" : "arriving",
      state: order.fulfillment_status === "delivered" ? ("done" as const) : ("pending" as const),
    },
  ]

  const timelineDotClasses = {
    done: "border-black bg-black text-white",
    current: "border-black bg-black text-white",
    pending: "border-ui-border-base bg-ui-bg-base text-ui-fg-subtle",
    canceled: "border-red-500 bg-red-500 text-white",
  }

  const timelineCardClasses = {
    done: "border-black bg-black/5",
    current: "border-black bg-black/5",
    pending: "border-ui-border-base bg-ui-bg-field",
    canceled: "border-red-200 bg-red-50",
  }

  const paymentBadgeColor = isCanceled
    ? "red"
    : isPaymentComplete
      ? "grey"
      : "orange"

  const fulfillmentBadgeColor = isCanceled
    ? "red"
    : isFulfillmentComplete
      ? "grey"
      : isFulfillmentInProgress
        ? "grey"
        : "grey"

  // Calculate current progress index for dynamic line extension based on fulfillment status
  const getCurrentProgressIndex = () => {
    // Timeline steps (0-indexed):
    // 0: Placed (Order received - when payment confirmed)
    // 1: Fulfillment (Preparing - when marked fulfilled)
    // 2: Complete (Order confirmed - fulfillment complete)
    // 3: Shipped (On its way - when marked shipped)
    // 4: Delivered (Ready - when marked delivered)

    if (order.fulfillment_status === "delivered") return 4 // Fully delivered
    if (order.fulfillment_status === "shipped") return 3 // All items shipped but not delivered yet
    if (
      order.fulfillment_status === "partially_shipped" ||
      order.fulfillment_status === "partially_fulfilled"
    )
      return 3 // Partially shipped
    if (order.fulfillment_status === "fulfilled") return 2 // Fully fulfilled but not shipped
    if (isPaymentComplete) return 1 // Payment confirmed, waiting for fulfillment
    return 0 // Not yet paid
  }

  const currentProgress = getCurrentProgressIndex()

  return (
    <div>
      <Text>
        We have sent the order confirmation details to{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Order date:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Order number: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      {showStatus && (
        <div className="mt-6 rounded-lg border border-ui-border-base bg-ui-bg-base p-4">
          <div className="flex flex-col gap-2 small:flex-row small:items-center small:justify-between">
            <Text className="text-sm font-semibold uppercase tracking-[0.12em]">
              Order timeline
            </Text>
            <div className="flex flex-wrap gap-2">
              <Badge color={fulfillmentBadgeColor}>
                Order: {formatStatus(order.fulfillment_status)}
              </Badge>
              <Badge color={paymentBadgeColor}>
                Payment: {formatStatus(order.payment_status)}
              </Badge>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              {timelineSteps.map((step, index) => {
                const isCompleted = index < currentProgress
                const isCurrent = index === currentProgress
                const isActive = isCompleted || isCurrent
                const isLast = index === timelineSteps.length - 1

                return (
                  <div key={step.title} className="flex flex-1 items-center">
                    <div className="flex flex-1 items-center">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                          isActive ? "border-black bg-black text-white" : "border-ui-border-base bg-ui-bg-base text-ui-fg-subtle"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {!isLast && (
                        <div
                          className={`mx-3 h-1 flex-1 rounded-full ${
                            isCompleted ? "bg-black" : "bg-ui-border-base"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-5 gap-3">
              {timelineSteps.map((step, index) => {
                const isCompleted = index < currentProgress
                const isCurrent = index === currentProgress
                const isActive = isCompleted || isCurrent

                return (
                  <div key={step.title} className="min-w-0 text-left">
                    <Text className={`text-sm font-semibold ${isActive ? "text-ui-fg-base" : "text-ui-fg-subtle"}`}>
                      {step.title}
                    </Text>
                    <Text className="mt-1 text-xs text-ui-fg-subtle">
                      {step.detail}
                    </Text>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
