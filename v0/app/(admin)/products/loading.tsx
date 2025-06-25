import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="bg-white rounded-md shadow p-4">
          <div className="flex items-center py-4 border-b">
            <Skeleton className="h-5 w-16 mr-12" />
            <Skeleton className="h-5 w-24 mr-12" />
            <Skeleton className="h-5 w-16 mr-12" />
            <Skeleton className="h-5 w-20 mr-12" />
            <Skeleton className="h-5 w-16 mr-12" />
            <Skeleton className="h-5 w-16 mr-12" />
            <Skeleton className="h-5 w-16" />
          </div>

          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex items-center py-6 border-b">
                <Skeleton className="h-12 w-12 mr-12" />
                <Skeleton className="h-5 w-32 mr-12" />
                <Skeleton className="h-5 w-16 mr-12" />
                <Skeleton className="h-5 w-24 mr-12" />
                <Skeleton className="h-5 w-16 mr-12" />
                <Skeleton className="h-5 w-20 mr-12" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
