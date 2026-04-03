# Sprint 2 : Mode Offline + Audio

## Objectif
Permettre la création de fiches, contributions et signalements sans connexion,
avec synchronisation automatique au retour en ligne.
Ajouter l'enregistrement audio pour les contributions de type récit/témoignage.

## Tâches

### Architect (architect)

1. ADR-001 : stratégie offline
   - Service Worker scope et cache strategy
   - Schéma IndexedDB : tables miroir heritage_items_local, contributions_local, reports_local, sync_queue
   - Stratégie de résolution de conflits : last-write-wins avec alerte utilisateur
   - Gestion des IDs : UUID v4 généré côté client, pas de collision possible

2. ADR-002 : stratégie audio
   - Enregistrement via MediaRecorder API (navigateur)
   - Format : webm/opus (compression native navigateur)
   - Taille max : 10 min / 5 Mo
   - Upload vers Storage bucket privé
   - Transcription Whisper : Edge Function async, résultat écrit dans contributions.body
   - Fallback si transcription échoue : audio disponible, body vide avec mention "transcription en cours"

### Backend (backend-dev)

1. Migration 002_sync_support.sql :
   - Colonnes sync_status, local_id, synced_at sur heritage_items, contributions et reports
   - Index sur sync_status pour batch queries

2. Edge Function sync-batch :
   - Réception batch de créations/modifications offline
   - Réponse avec mapping local_id vers server_id
   - Gestion idempotente (re-sync safe)

3. Edge Function transcribe-audio :
   - Déclenchée par insert sur contributions avec audio_url non null
   - Appel Whisper API (OpenAI ou self-hosted)
   - Écriture résultat dans contributions.body
   - Update d'un champ transcription_status : pending, completed, failed

4. Webhook Supabase Realtime :
   - Notification push quand statut signalement change
   - Notification quand transcription audio terminée

### Frontend (frontend-dev)

1. Service Worker :
   - Cache shell app (HTML/CSS/JS) : cache-first
   - API calls : network-first avec fallback IndexedDB
   - Tuiles carte : cache-first avec expiration 7 jours

2. Hook useOfflineStorage : abstraction IndexedDB pour CRUD local
3. Hook useSyncQueue : détection online/offline, sync automatique, retry exponentiel backoff
4. Indicateur UI : badge offline/online dans header, compteur éléments en attente de sync
5. Gestion conflits : modale de résolution quand le serveur a une version plus récente

6. Composant AudioRecorder :
   - Bouton enregistrer/stop/réécouter
   - Visualisation waveform temps réel (canvas simple)
   - Affiché uniquement pour contribution_type = recit ou temoignage
   - Upload automatique après validation
   - Indicateur "transcription en cours" sur la contribution

### QA (qa)

1. Test e2e offline : simuler mode avion, créer fiche + contribution, revenir en ligne, vérifier sync
2. Test conflits : modification simultanée online/offline, vérification résolution
3. Test Service Worker : cache invalidation, update flow
4. Test audio : enregistrement, upload, transcription callback
5. Test RLS offline sync : vérifier que le batch sync respecte les policies

## Definition of Done
- Parcours complet offline testé sur Chrome et Safari mobile
- Sync queue vide après retour en ligne (< 30s pour 10 éléments)
- Aucune perte de données en cas de fermeture app pendant sync
- Enregistrement audio fonctionnel sur mobile Chrome et Safari
- Transcription Whisper retourne un résultat en < 60s pour 5 min d'audio
