"use client"

import * as React from "react"

// =============================================================================
// ServiceWorkerRegister
// Intent : Enregistre le SW au premier rendu côté client.
//          Composant léger, sans rendu DOM — retourne null.
//          Placé dans le root layout pour un enregistrement global.
// =============================================================================

export function ServiceWorkerRegister() {
  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // Demande une vérification de mise à jour en arrière-plan
        void registration.update()
      })
      .catch(() => {
        // Échec silencieux — l'app fonctionne sans SW
      })
  }, [])

  return null
}
