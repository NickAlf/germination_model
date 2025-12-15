import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ThesisChapterPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl">Documentation</CardTitle>
              <p className="text-sm text-gray-600">System architecture and technical documentation</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            View technical documentation, architecture diagrams, and system specifications.
          </p>
          <Link href="/architecture">
            <Button>View Architecture Documentation</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
