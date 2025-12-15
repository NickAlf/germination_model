"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Server, Cloud, Gift, ExternalLink, CheckCircle } from "lucide-react"

export function ModelSetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Free AI Model Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="huggingface" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="huggingface">
                <Cloud className="w-4 h-4 mr-2" />
                Hugging Face
              </TabsTrigger>
              <TabsTrigger value="ollama">
                <Server className="w-4 h-4 mr-2" />
                Ollama (Local)
              </TabsTrigger>
              <TabsTrigger value="openai-free">
                <Gift className="w-4 h-4 mr-2" />
                OpenAI Free
              </TabsTrigger>
            </TabsList>

            <TabsContent value="huggingface" className="space-y-4">
              <Alert>
                <Cloud className="h-4 w-4" />
                <AlertDescription>
                  <strong>Hugging Face Models</strong> - No setup required! These models run on Hugging Face's free
                  inference API.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">BLIP-2 Vision</h3>
                    <Badge className="bg-green-500">Ready to Use</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Basic image captioning model. Good for simple analysis.</p>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    No setup required - works immediately
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">LLaVA 1.5</h3>
                    <Badge className="bg-green-500">Ready to Use</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Advanced multimodal model with better reasoning capabilities.
                  </p>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    No setup required - may have longer loading times
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Rate Limits:</strong> Hugging Face free tier has usage limits. If you get rate limited, try
                  again in a few minutes or consider setting up Ollama for unlimited local usage.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="ollama" className="space-y-4">
              <Alert>
                <Server className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ollama</strong> - Run AI models locally on your computer. Completely free and private!
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Step 1: Install Ollama</h3>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-sm mb-2">
                    curl -fsSL https://ollama.ai/install.sh | sh
                  </div>
                  <p className="text-sm text-gray-600">
                    Or download from{" "}
                    <a href="https://ollama.ai" className="text-blue-600 underline">
                      ollama.ai
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Step 2: Pull the LLaVA Model</h3>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-sm mb-2">ollama pull llava:7b</div>
                  <p className="text-sm text-gray-600">This downloads the 7B parameter LLaVA model (~4GB)</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Step 3: Start Ollama Server</h3>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-sm mb-2">ollama serve</div>
                  <p className="text-sm text-gray-600">Starts the Ollama server on localhost:11434</p>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Benefits:</strong> Unlimited usage, complete privacy, no API keys needed, works offline once
                    installed.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertDescription>
                    <strong>Requirements:</strong> 8GB+ RAM recommended, 5GB+ free disk space. Performance depends on
                    your hardware.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="openai-free" className="space-y-4">
              <Alert>
                <Gift className="h-4 w-4" />
                <AlertDescription>
                  <strong>OpenAI Free Tier</strong> - Get free credits when you sign up for OpenAI.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Step 1: Create OpenAI Account</h3>
                  <Button variant="outline" asChild>
                    <a href="https://platform.openai.com/signup" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Sign up at OpenAI
                    </a>
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">New accounts receive free credits to get started</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Step 2: Get Your API Key</h3>
                  <Button variant="outline" asChild>
                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get API Key
                    </a>
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">Create a new API key and copy it to use in the app</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Step 3: Use GPT-4o Mini</h3>
                  <p className="text-sm text-gray-600">
                    Select "GPT-4o Mini (Free Tier)" in the model selection and enter your API key. This model is
                    included in the free tier with usage limits.
                  </p>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Free Tier Limits:</strong> $5 in free credits for new accounts, then pay-as-you-go. GPT-4o
                    Mini is very cost-effective at ~$0.15 per 1M tokens.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Hugging Face: "Model is loading"</h4>
              <p className="text-sm text-gray-600">
                Wait 1-2 minutes and try again. Free models sometimes need time to "warm up".
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Ollama: "Connection refused"</h4>
              <p className="text-sm text-gray-600">
                Make sure Ollama is running: <code className="bg-gray-100 px-1 rounded">ollama serve</code>
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">OpenAI: "Invalid API key"</h4>
              <p className="text-sm text-gray-600">Check that your API key is correct and has available credits.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
