// =============================================================================
// Route handler Auth.js — /api/auth/[...nextauth]
// Intent : Délègue toutes les requêtes d'authentification au handler Auth.js.
//          Couvre : signin, signout, callback OAuth, vérification magic link.
// =============================================================================

import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
