import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

const AlumniNetworkSkeleton = () => {
  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8">
        <div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="items-center text-center">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Skeleton className="h-4 w-1/4 mx-auto" />
                    <div className="flex justify-center gap-2 mt-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AlumniNetworkSkeleton;
