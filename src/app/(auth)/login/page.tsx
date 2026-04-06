"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Mail, Landmark, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type LoginState = "idle" | "loading-email" | "loading-google" | "success" | "error"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [state, setState] = React.useState<LoginState>("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return

    setState("loading-email")
    setErrorMessage("")

    try {
      const result = await signIn("email", { email: email.trim(), redirect: false })

      if (result?.error) {
        throw new Error(result.error)
      }

      setState("success")
    } catch (err) {
      setState("error")
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      )
    }
  }

  const handleGoogleSignIn = async () => {
    setState("loading-google")
    await signIn("google")
  }

  const isLoading = state === "loading-email" || state === "loading-google"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      {/* Logo & titre */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-xl bg-blue-800 shadow-md">
          <Landmark className="size-7 text-white" />
        </div>
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-stone-800">
            Patrimoine &amp; Sens
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Documentez et protégez le patrimoine local
          </p>
        </div>
      </div>

      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg font-semibold text-stone-800">
            Connexion
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Recevez un lien de connexion par e-mail
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state === "success" ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                <Mail className="size-6 text-blue-800" />
              </div>
              <div>
                <p className="font-medium text-stone-800">Lien envoyé !</p>
                <p className="mt-1 text-sm text-stone-500">
                  Consultez votre boîte mail{" "}
                  <span className="font-medium text-stone-700">{email}</span>{" "}
                  pour vous connecter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setState("idle")
                  setEmail("")
                }}
                className="text-sm text-blue-800 hover:underline"
              >
                Utiliser une autre adresse
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={(e) => void handleEmailSubmit(e)} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Adresse e-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    className={cn(
                      state === "error" && "border-red-400 focus-visible:ring-red-300"
                    )}
                  />
                </div>

                {state === "error" && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white"
                  disabled={isLoading || !email.trim()}
                >
                  {state === "loading-email" ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 size-4" />
                      Recevoir le lien de connexion
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-stone-400">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => void handleGoogleSignIn()}
              >
                {state === "loading-google" ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Redirection…
                  </>
                ) : (
                  "Connexion avec Google"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-stone-400">
        En vous connectant, vous acceptez nos{" "}
        <a href="#" className="underline hover:text-stone-600">
          conditions d&apos;utilisation
        </a>
      </p>
    </div>
  )
}
