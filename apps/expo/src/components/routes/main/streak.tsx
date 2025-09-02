import type { FC } from "react"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { CheckIcon, SunIcon, XIcon } from "lucide-react-native"
import { View } from "react-native"

import * as Table from "~/ui/table"
import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { calculateCurrentWeekProgress, DayStatus } from "~/utils/streak"
import { cn } from "~/utils/utils"

type DayIndicatorProps = {
  status: DayStatus
  day: string
}
const DayIndicator: React.FC<DayIndicatorProps> = ({ status, day }) => {
  return (
    <View className="flex flex-col items-center gap-2">
      <View
        className={cn(
          "size-7 items-center justify-center rounded-full border",
          status === DayStatus.COMPLETED && "border-success-500 bg-success-500",
          status === DayStatus.UPCOMING && "border-neutral-100 bg-neutral-100",
          status === DayStatus.MISSED && "border-neutral-300 bg-neutral-300",
          status === DayStatus.PENDING && "border-neutral-200 bg-neutral-50",
        )}
      >
        {status === DayStatus.COMPLETED && <CheckIcon size={16} strokeWidth={4} stroke="white" color="white" />}
        {status === DayStatus.MISSED && <XIcon size={16} strokeWidth={4} stroke="white" color="white" />}
        {status === DayStatus.PENDING && <View className="size-2.5 rounded-full bg-neutral-200" />}
      </View>
      <Text className="text-xs text-neutral-500">{day}</Text>
    </View>
  )
}

const Streak: FC = () => {
  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Failed to fetch profile")

  const streakDays = useQuery(trpc.profile.streakDays.queryOptions({ startDate: undefined, endDate: undefined }))
  if (!streakDays.data) throw new Error("Streak days not found")

  const { daysLabels, weekProgress } = calculateCurrentWeekProgress(streakDays.data, profileMe.data.timezone)

  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.RowHeader className="py-2">
          <Table.Head className="flex-1">
            <View className="flex flex-row items-center justify-between gap-2">
              <View className="flex flex-row items-center gap-1.5">
                <SunIcon size={16} className="text-neutral-500" />
                <Text>Daily check-ins</Text>
              </View>
              <Text>🔥 {profileMe.data.currentStreak}</Text>
            </View>
          </Table.Head>
        </Table.RowHeader>
      </Table.Header>
      <Table.Body>
        <Table.RowBody isLast>
          <Table.Cell className="px-1 pt-1">
            <View className="w-full flex-row justify-between gap-2">
              {daysLabels.map((day, index) => (
                <DayIndicator key={day + index} day={day} status={weekProgress[index] ?? DayStatus.UPCOMING} />
              ))}
            </View>
          </Table.Cell>
        </Table.RowBody>
      </Table.Body>
    </Table.Root>
  )
}

export default Streak
