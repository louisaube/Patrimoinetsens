"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Search, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import annuaireData from "../../../../public/armorial/annuaire.json"

// ─── Types ──────────────────────────────────────────────────────────────────

interface BlasonEntry {
  nom: string
  titre: string
  lieu: string
  blason: string
  couleurs: string[]
  source: string
  image: string
  type: "personne" | "institution"
}

interface Annuaire {
  meta: {
    source: string
    volume: string
    section: string
    pages: string
    total: number
  }
  entries: BlasonEntry[]
}

const annuaire = annuaireData as Annuaire

// ─── Helpers ────────────────────────────────────────────────────────────────

const EMAUX: Record<string, { bg: string; border: string; label: string }> = {
  azur: { bg: "bg-blue-600", border: "border-blue-700", label: "Azur (bleu)" },
  gueules: { bg: "bg-red-600", border: "border-red-700", label: "Gueules (rouge)" },
  or: { bg: "bg-yellow-400", border: "border-yellow-500", label: "Or (jaune)" },
  argent: { bg: "bg-gray-100", border: "border-gray-300", label: "Argent (blanc)" },
  sable: { bg: "bg-gray-900", border: "border-black", label: "Sable (noir)" },
  sinople: { bg: "bg-green-600", border: "border-green-700", label: "Sinople (vert)" },
  pourpre: { bg: "bg-purple-600", border: "border-purple-700", label: "Pourpre (violet)" },
}

/** Petit encart pédagogique selon le titre */
function getTitreContext(titre: string, type: string): string | null {
  if (type === "institution") {
    if (titre === "" || !titre) return "Les institutions (abbayes, couvents, corps de métiers) devaient aussi enregistrer leurs armes. C'était souvent le supérieur qui payait la taxe de 20 livres tournois — soit 20 journées de travail d'un ouvrier."
    return null
  }
  const t = titre.toLowerCase()
  if (t.includes("directeur des aides"))
    return "Les « aides » sont des impôts indirects sur les boissons, le sel, les marchandises. Le directeur des aides supervise leur collecte dans toute l'Élection. Aujourd'hui, ce serait le directeur départemental des Finances publiques — un haut fonctionnaire fiscal."
  if (t.includes("préchantre") || t.includes("prechantre"))
    return "Le préchantre dirige le chant et la liturgie de la cathédrale. C'est l'un des « dignitaires » du chapitre, juste en dessous du doyen. Il choisit les chantres, organise les cérémonies. Aujourd'hui, ce serait un directeur artistique d'une grande institution culturelle."
  if (t.includes("chirurgien"))
    return "Attention, en 1696 le chirurgien n'est PAS un médecin. Il est en dessous : le médecin (« docteur en médecine ») a fait l'université, le chirurgien est un artisan formé par apprentissage. Le chirurgien opère avec ses mains (du grec kheir = main), le médecin prescrit. Aujourd'hui, c'est l'inverse — le chirurgien est au sommet !"
  if (t.includes("docteur en médecine"))
    return "Le docteur en médecine a étudié à l'université (souvent Montpellier ou Paris). En 1696, il est très au-dessus du chirurgien : il diagnostique et prescrit, mais ne touche jamais le patient. C'est le médecin généraliste d'aujourd'hui, mais avec le prestige d'un professeur de CHU."
  if (t.includes("doyen"))
    return "Le doyen est le chef du chapitre de la cathédrale — le « patron » des chanoines. Il préside les réunions, gère les biens, représente le chapitre face à l'évêque. Aujourd'hui, ce serait un président d'université ou un directeur général d'hôpital."
  if (t.includes("chanoine"))
    return "Un chanoine est un membre permanent du clergé d'une cathédrale ou collégiale. En 1696, c'est un poste stable et bien rémunéré — l'équivalent d'un haut fonctionnaire rattaché à une grande institution publique."
  if (t.includes("lieutenant criminel"))
    return "Le lieutenant criminel est le juge qui instruit et juge les affaires pénales (vols, meurtres, faux). C'est un poste puissant et redouté. Aujourd'hui, ce serait un procureur de la République ou un juge d'instruction."
  if (t.includes("lieutenant"))
    return "Le bailli était le représentant du roi qui rendait la justice dans une région. Mais en 1696, les baillis sont devenus des titres honorifiques — le poste est occupé par des grands seigneurs qui n'y mettent jamais les pieds. C'est le « lieutenant » (littéralement « celui qui tient lieu de ») qui fait le vrai travail : juger, administrer, maintenir l'ordre. Aujourd'hui, ce serait un président de tribunal."
  if (t.includes("écuyer"))
    return "L'écuyer est le premier échelon de la noblesse. Ce n'est pas forcément quelqu'un de riche ou puissant, mais il a un statut juridique de « noble ». Aujourd'hui, on dirait un notaire ou avocat bien établi en province."
  if (t.includes("chevalier"))
    return "Le chevalier est un noble de rang supérieur à l'écuyer, souvent issu d'une famille militaire ancienne. Aujourd'hui, ce serait un officier supérieur ou un préfet — quelqu'un avec des responsabilités régionales."
  if (t.includes("conseiller du roy") || t.includes("conseiller du roi"))
    return "Le « Conseiller du Roy » a acheté sa charge — oui, on achetait son poste ! C'est un officier de justice ou d'administration. L'équivalent d'un magistrat qui aurait payé pour sa nomination."
  if (t.includes("conseiller"))
    return "Un conseiller est un officier de justice ou d'administration. En 1696, ces charges s'achètent et se transmettent en famille, comme un fonds de commerce."
  if (t.includes("seigneur"))
    return null // Déjà couvert par le titre affiché
  if (t.includes("prêtre") || t.includes("curé"))
    return "En 1696, le curé est bien plus qu'un prêtre : il tient l'état civil (naissances, mariages, décès), gère l'école et l'aide aux pauvres. C'est le maire de la commune avant que les maires n'existent."
  if (t.includes("archidiacre"))
    return "L'archidiacre est le représentant de l'archevêque sur un territoire. Sens est alors la Primatie des Gaules — le plus haut rang de l'Église de France, au-dessus de Paris ! Avoir des archidiacres à Provins ou Melun montre l'étendue du pouvoir de l'archevêché sénonais. Aujourd'hui, ce serait un sous-préfet rattaché à une préfecture de région."
  if (t.includes("marquis"))
    return "Le marquis est un titre de haute noblesse, au-dessus du comte. En 1696, ce titre peut être authentique (famille ancienne) ou récent (acheté). Aujourd'hui ? Un grand patron d'industrie avec un nom à particule."
  if (t.includes("capitaine"))
    return "Un capitaine commande une compagnie de soldats (environ 100 hommes). En 1696, la France est en guerre quasi-permanente — c'est un métier dangereux mais qui ouvre des portes."
  if (t.includes("docteur"))
    return "Un « Docteur de Sorbonne » en 1696, c'est l'élite intellectuelle absolue. L'équivalent d'un professeur d'université titulaire aujourd'hui, mais avec beaucoup plus de prestige social."
  if (t.includes("maire"))
    return "En 1696, le maire est élu par les notables de la ville (pas par tous les habitants). C'est un bourgeois influent, souvent marchand ou magistrat."
  if (t.includes("trésorier"))
    return "Le trésorier d'une église gère les revenus considérables du chapitre : dîmes, loyers, rentes. C'est un poste financier important — l'équivalent d'un directeur financier."
  if (t.includes("veuve"))
    return "En 1696, une veuve noble hérite du statut de son mari et gère elle-même le patrimoine. C'est l'un des rares cas où une femme a une existence juridique autonome."
  if (t.includes("fille") || t.includes("demoiselle"))
    return "« Fille » au sens de 1696 signifie « demoiselle non mariée ». Si elle figure dans l'Armorial, c'est qu'elle possède des biens en propre — c'est rare et notable."
  if (t.includes("gentilhomme"))
    return "Le gentilhomme est un noble de naissance (pas anobli récemment). C'est un titre qui dit « ma famille est noble depuis au moins trois générations ». Ça ouvre des droits : port d'épée, exemption de certains impôts, accès aux charges militaires."
  return null
}

/** Extrait le nom de seigneurie du titre et renvoie un lien Géoportail */
/** Seigneuries identifiées dans l'ancien Sénonais (Élection de Sens) */
const SEIGNEURIES: Record<string, { commune: string; dept: string; lat: number; lon: number }> = {
  "Champigny":         { commune: "Champigny-sur-Yonne",       dept: "Yonne",           lat: 48.212, lon: 3.345 },
  "Jouy":              { commune: "Jouy",                      dept: "Yonne",           lat: 48.085, lon: 3.117 },
  "Montcorbon":        { commune: "Douchy-Montcorbon",         dept: "Loiret",          lat: 48.075, lon: 2.847 },
  "Fontaineroux":      { commune: "Héricy",                    dept: "Seine-et-Marne",  lat: 48.435, lon: 2.775 },
  "Maisonselles":      { commune: "Maisoncelles-en-Gâtinais",  dept: "Seine-et-Marne",  lat: 48.187, lon: 2.626 },
  "Villiers l'Onglon": { commune: "Saint-Mars-Vieux-Maisons",  dept: "Seine-et-Marne",  lat: 48.543, lon: 3.183 },
  "Vieuxmaisons":      { commune: "Saint-Mars-Vieux-Maisons",  dept: "Seine-et-Marne",  lat: 48.543, lon: 3.183 },
  "Méry":              { commune: "Méry-sur-Oise",             dept: "Val-d'Oise",      lat: 49.067, lon: 2.183 },
  "Plaisance":         { commune: "Thorigny-sur-Oreuse",       dept: "Yonne",           lat: 48.288, lon: 3.280 },
  "Rochefort":         { commune: "Rochefort (Sénonais)",      dept: "Yonne",           lat: 48.220, lon: 3.150 },
}

function getSeigneurieSearch(titre: string): { nom: string; commune?: string; dept?: string; url: string; identified: boolean } | null {
  if (!titre) return null
  const m = titre.match(/(?:Seigneur|Sgr\.|Marquis|Baron|Comte) de ([A-ZÀ-Ü][a-zà-ü'-]+(?:[\s-]+[a-zà-ü'A-ZÀ-Ü-]+)*)/i)
  if (!m) return null
  const lieu = m[1].trim()
  if (lieu.length < 3 || ["trois Maisons", "autres lieux"].includes(lieu)) return null

  const known = SEIGNEURIES[lieu]
  if (known) {
    return {
      nom: lieu,
      commune: known.commune,
      dept: known.dept,
      url: `https://www.geoportail.gouv.fr/carte?c=${known.lon},${known.lat}&z=14&l0=GEOGRAPHICALGRIDSYSTEMS.MAPS::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`,
      identified: true,
    }
  }

  const query = encodeURIComponent(lieu)
  return {
    nom: lieu,
    url: `https://www.geoportail.gouv.fr/carte?c=3.28,48.20&z=11&l0=GEOGRAPHICALGRIDSYSTEMS.MAPS::GEOPORTAIL:OGC:WMTS(1)&permalink=yes&q=${query}`,
    identified: false,
  }
}

/** Liens Wikipedia pour les familles notables */
function getWikipediaUrl(nom: string): string | null {
  const links: Record<string, string> = {
    "Hurault": "https://fr.wikipedia.org/wiki/Famille_Hurault",
    "Bizemont": "https://fr.wikipedia.org/wiki/Famille_de_Bizemont",
    "Chavigny": "https://fr.wikipedia.org/wiki/Chauvigny_(famille)",
    "Moreuil": "https://fr.wikipedia.org/wiki/Moreuil",
    "Sainte-Chamand": "https://fr.wikipedia.org/wiki/Famille_de_Saint-Chamans",
  }
  for (const [key, url] of Object.entries(links)) {
    if (nom.includes(key)) return url
  }
  return null
}

// ─── Page ───────────────────────────────────────────────────────────────────

type FilterTab = "tous" | "personne" | "institution"

export default function ArmorialPage() {
  const [filter, setFilter] = React.useState<FilterTab>("tous")
  const [search, setSearch] = React.useState("")
  const [selected, setSelected] = React.useState<BlasonEntry | null>(null)

  const filtered = React.useMemo(() => {
    let entries = annuaire.entries
    if (filter !== "tous") {
      entries = entries.filter((e) => e.type === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      entries = entries.filter(
        (e) =>
          e.nom.toLowerCase().includes(q) ||
          e.titre.toLowerCase().includes(q) ||
          e.lieu.toLowerCase().includes(q) ||
          e.blason.toLowerCase().includes(q)
      )
    }
    return entries
  }, [filter, search])

  const counts = React.useMemo(() => ({
    tous: annuaire.entries.length,
    personne: annuaire.entries.filter((e) => e.type === "personne").length,
    institution: annuaire.entries.filter((e) => e.type === "institution").length,
  }), [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* En-tete */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Accueil
        </Link>

        <h1 className="font-serif text-2xl font-bold text-stone-800 sm:text-3xl">
          Armorial d&apos;Hozier
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {annuaire.meta.section} &middot; {annuaire.meta.total} blasons &middot; 1696
        </p>
        <p className="mt-0.5 text-xs text-stone-400">
          {annuaire.meta.volume}, p.&nbsp;{annuaire.meta.pages} &middot; BnF&nbsp;/&nbsp;Gallica
        </p>
        <Link
          href="/armorial/lire-un-blason"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          Apprendre &agrave; lire un blason &rarr;
        </Link>

        {/* Comprendre les titres */}
        <details className="mt-4 rounded-lg border border-stone-200 bg-stone-50/50">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-stone-700 hover:text-stone-900">
            Comprendre les titres de 1696 &mdash; &agrave; quoi &ccedil;a correspond aujourd&apos;hui&nbsp;?
          </summary>
          <div className="px-4 pb-4 space-y-3 text-sm text-stone-600 leading-relaxed">
            <p className="text-xs text-stone-400 italic">
              En 1696, Louis&nbsp;XIV cr&eacute;e l&apos;Armorial g&eacute;n&eacute;ral pour une raison simple&nbsp;: lever un imp&ocirc;t.
              Chaque personne ou institution &laquo;&nbsp;notable&nbsp;&raquo; doit enregistrer ses armoiries &mdash; et payer 20&nbsp;livres.
              Ceux qui n&apos;en ont pas s&apos;en voient attribuer d&apos;office.
              Ce n&apos;est pas un honneur, c&apos;est une taxe.
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-stone-200 bg-white p-3">
                <p className="font-semibold text-stone-800">Chanoine <span className="font-normal text-stone-400">(26)</span></p>
                <p className="mt-1 text-xs">
                  Membre du &laquo;&nbsp;chapitre&nbsp;&raquo; d&apos;une cath&eacute;drale.
                  Un poste &agrave; vie, bien pay&eacute;, parfois cumul&eacute;.
                  Aujourd&apos;hui&nbsp;? Un haut fonctionnaire territorial rattach&eacute; &agrave; une grande institution.
                </p>
              </div>

              <div className="rounded-md border border-stone-200 bg-white p-3">
                <p className="font-semibold text-stone-800">&Eacute;cuyer <span className="font-normal text-stone-400">(19)</span></p>
                <p className="mt-1 text-xs">
                  Le premier &eacute;chelon de la noblesse. Ni riche ni puissant forc&eacute;ment, mais &laquo;&nbsp;noble&nbsp;&raquo; au sens juridique.
                  Aujourd&apos;hui&nbsp;? Un notaire ou avocat bien &eacute;tabli en province &mdash; respect&eacute; localement, inconnu &agrave; Paris.
                </p>
              </div>

              <div className="rounded-md border border-stone-200 bg-white p-3">
                <p className="font-semibold text-stone-800">Seigneur de... <span className="font-normal text-stone-400">(21)</span></p>
                <p className="mt-1 text-xs">
                  Propri&eacute;taire d&apos;une terre qui porte un nom. Il y per&ccedil;oit des droits (p&eacute;ages, droit de justice).
                  Aujourd&apos;hui&nbsp;? Un propri&eacute;taire foncier important, genre &laquo;&nbsp;pr&eacute;sident du syndicat agricole de Jouy&nbsp;&raquo;.
                </p>
              </div>

              <div className="rounded-md border border-stone-200 bg-white p-3">
                <p className="font-semibold text-stone-800">Conseiller du Roy <span className="font-normal text-stone-400">(12)</span></p>
                <p className="mt-1 text-xs">
                  Titre achet&eacute; &mdash; oui, on achetait sa charge&nbsp;! C&apos;&eacute;tait un office de justice ou d&apos;administration.
                  Aujourd&apos;hui&nbsp;? Un magistrat ou un cadre sup de la fonction publique, mais qui aurait achet&eacute; son poste.
                </p>
              </div>

              <div className="rounded-md border border-stone-200 bg-white p-3">
                <p className="font-semibold text-stone-800">Chevalier <span className="font-normal text-stone-400">(7)</span></p>
                <p className="mt-1 text-xs">
                  Noble de rang sup&eacute;rieur &agrave; l&apos;&eacute;cuyer, souvent militaire ou issu d&apos;une famille ancienne.
                  Aujourd&apos;hui&nbsp;? Un officier sup&eacute;rieur ou un pr&eacute;fet &mdash; quelqu&apos;un qui a des responsabilit&eacute;s r&eacute;gionales.
                </p>
              </div>

              <div className="rounded-md border border-stone-200 bg-white p-3">
                <p className="font-semibold text-stone-800">Pr&ecirc;tre / Cur&eacute; <span className="font-normal text-stone-400">(7)</span></p>
                <p className="mt-1 text-xs">
                  Responsable d&apos;une paroisse. En 1696, le cur&eacute; est aussi l&apos;&eacute;tat civil, l&apos;&eacute;cole, l&apos;aide sociale.
                  Aujourd&apos;hui&nbsp;? Le maire d&apos;une commune rurale &mdash; la personne qui g&egrave;re tout au quotidien.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 mt-2">
              <strong>Et le prestige&nbsp;?</strong> L&apos;Armorial d&apos;Hozier n&apos;est pas un &laquo;&nbsp;Who&apos;s Who&nbsp;&raquo;.
              C&apos;est un registre fiscal. Beaucoup de ces gens n&apos;&eacute;taient pas prestigieux &mdash;
              ils &eacute;taient juste assez visibles pour &ecirc;tre tax&eacute;s. Certains ont m&ecirc;me refus&eacute; de payer
              et se sont vu attribuer un blason ridicule d&apos;office (un &acirc;ne, un chat...).
            </p>
          </div>
        </details>
      </div>

      {/* Filtres */}
      <div className="space-y-3">
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as FilterTab)}
        >
          <TabsList className="h-9">
            <TabsTrigger value="tous" className="text-xs">
              Tous ({counts.tous})
            </TabsTrigger>
            <TabsTrigger value="personne" className="text-xs">
              Personnes ({counts.personne})
            </TabsTrigger>
            <TabsTrigger value="institution" className="text-xs">
              Institutions ({counts.institution})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <Input
            placeholder="Rechercher un nom, un titre, une description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9 h-9 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Compteur resultats */}
      <p className="text-xs text-stone-400">
        {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grille */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((entry) => (
          <button
            key={entry.image}
            onClick={() => setSelected(entry)}
            className="text-left"
          >
            <Card className="bg-white border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden h-full">
              <div className="aspect-square bg-stone-50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/armorial/blasons/${encodeURIComponent(entry.image)}`}
                  alt={`Blason de ${entry.nom}`}
                  className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-3 space-y-1">
                <p className="text-sm font-medium text-stone-800 leading-tight line-clamp-2">
                  {entry.nom}
                </p>
                {entry.titre && (
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {entry.titre}
                  </p>
                )}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-stone-400">
          Aucun blason trouvé pour cette recherche.
        </div>
      )}

      {/* Dialog detail — mini-exposition muséale */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {selected && (() => {
            const titreCtx = getTitreContext(selected.titre, selected.type)
            const wikiUrl = getWikipediaUrl(selected.nom)
            const seigneurie = getSeigneurieSearch(selected.titre)
            return (
              <div>
                {/* Image du blason */}
                <div className="bg-stone-50 p-6 flex items-center justify-center relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/armorial/blasons/${encodeURIComponent(selected.image)}`}
                    alt={`Blason de ${selected.nom}`}
                    className="max-h-64 object-contain"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-stone-800/70 text-white px-2 py-1 rounded">
                      1696
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Identité */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-serif text-lg font-bold text-stone-800">
                        {selected.nom}
                      </h2>
                      {selected.type === "institution" && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          Institution
                        </Badge>
                      )}
                    </div>
                    {selected.titre && (
                      <p className="text-sm text-stone-600 mt-0.5">{selected.titre}</p>
                    )}
                    {selected.lieu && (
                      <p className="text-xs text-stone-500 mt-0.5">{selected.lieu}</p>
                    )}
                    {wikiUrl && (
                      <a
                        href={wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Voir sur Wikip&eacute;dia &rarr;
                      </a>
                    )}
                    {seigneurie && (
                      <div className="mt-2 rounded-md bg-blue-50 border border-blue-200 p-2">
                        <p className="text-xs text-blue-700">
                          <span className="font-medium">O&ugrave; est {seigneurie.nom}&nbsp;?</span>{" "}
                          {seigneurie.identified ? (
                            <>
                              Aujourd&apos;hui <strong>{seigneurie.commune}</strong> ({seigneurie.dept}).{" "}
                              <a
                                href={seigneurie.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-900"
                              >
                                Voir sur G&eacute;oportail (IGN) &rarr;
                              </a>
                            </>
                          ) : (
                            <>
                              Cette seigneurie d&eacute;pendait de l&apos;&Eacute;lection de Sens (ancien S&eacute;nonais).{" "}
                              <a
                                href={seigneurie.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-900"
                              >
                                Chercher sur G&eacute;oportail (IGN) &rarr;
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Encart pédagogique — contexte du titre */}
                  {titreCtx && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <p className="text-xs font-medium text-amber-800 mb-1">
                        Qu&apos;est-ce que &ccedil;a veut dire&nbsp;?
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        {titreCtx}
                      </p>
                    </div>
                  )}

                  {/* Description héraldique */}
                  {selected.blason && (
                    <div>
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
                        Description h&eacute;raldique
                      </p>
                      <p className="text-sm text-stone-700 leading-relaxed italic">
                        {selected.blason}
                      </p>
                    </div>
                  )}

                  {/* Émaux — pastilles de couleur */}
                  {selected.couleurs && selected.couleurs.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
                        &Eacute;maux utilis&eacute;s
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selected.couleurs.map((c) => {
                          const e = EMAUX[c]
                          if (!e) return null
                          return (
                            <span
                              key={c}
                              className="inline-flex items-center gap-1.5 text-xs text-stone-600"
                            >
                              <span
                                className={`size-3 rounded-full ${e.bg} border ${e.border}`}
                              />
                              {e.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Contextualisation historique */}
                  <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                    <p className="text-xs font-medium text-stone-500 mb-1">
                      Le saviez-vous&nbsp;?
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {selected.type === "institution"
                        ? "En 1696, m\u00eame les abbayes, couvents et corps de m\u00e9tiers doivent payer pour enregistrer leurs armes. La taxe de 20\u00a0livres tournois (20\u00a0journ\u00e9es de travail d\u2019un ouvrier) est r\u00e9gl\u00e9e par le sup\u00e9rieur. Certains couvents pauvres tentent d\u2019y \u00e9chapper \u2014 en vain."
                        : selected.titre?.toLowerCase().includes("chanoine") || selected.titre?.toLowerCase().includes("pr\u00eatre") || selected.titre?.toLowerCase().includes("archidiacre") || selected.titre?.toLowerCase().includes("cur\u00e9")
                        ? "En 1696, l\u2019archev\u00eaque de Sens est le \u00ab\u00a0Primat des Gaules\u00a0\u00bb — le plus haut rang de l\u2019\u00c9glise de France\u00a0! Il a autorit\u00e9 sur sept dioc\u00e8ses\u00a0: Paris, Chartres, Meaux, Orl\u00e9ans, Auxerre, Nevers et Troyes. Les chanoines et archidiacres list\u00e9s ici (y compris ceux de Provins ou Melun) sont les rouages de cette puissance\u00a0: Sens commande, ils ex\u00e9cutent."
                        : selected.titre?.toLowerCase().includes("chevalier") || selected.titre?.toLowerCase().includes("\u00e9cuyer") || selected.titre?.toLowerCase().includes("gentilhomme")
                        ? "En 1696, Louis\u00a0XIV est en pleine guerre de la Ligue d\u2019Augsbourg (contre toute l\u2019Europe\u00a0!). Il a besoin d\u2019argent. L\u2019\u00e9dit de novembre 1696 oblige chaque noble \u00e0 enregistrer ses armes et \u00e0 payer 20\u00a0livres tournois — soit environ 20\u00a0journ\u00e9es de travail d\u2019un ouvrier (l\u2019\u00e9quivalent d\u2019un bon mois de SMIC). Ce n\u2019est pas un honneur, c\u2019est une taxe."
                        : "L\u2019Armorial d\u2019Hozier n\u2019est pas un annuaire de prestige. C\u2019est un registre fiscal\u00a0: Louis\u00a0XIV taxe tous les notables pour financer ses guerres. Refuser de payer\u00a0? On vous attribue un blason d\u2019office, parfois humiliant (\u00e2ne, chat, outil de m\u00e9tier...)."
                      }
                    </p>
                  </div>

                  {/* Sigilla — sceaux médiévaux pour les ecclésiastiques */}
                  {(selected.titre?.toLowerCase().includes("chanoine") ||
                    selected.titre?.toLowerCase().includes("archidiacre") ||
                    selected.titre?.toLowerCase().includes("pr\u00eatre") ||
                    selected.titre?.toLowerCase().includes("cur\u00e9") ||
                    selected.titre?.toLowerCase().includes("vicaire") ||
                    selected.titre?.toLowerCase().includes("pr\u00e9chantre") ||
                    selected.type === "institution") && (
                    <div className="rounded-lg bg-violet-50 border border-violet-200 p-3">
                      <p className="text-xs font-medium text-violet-700 mb-1">
                        Avant les blasons&nbsp;: les sceaux
                      </p>
                      <p className="text-xs text-violet-600 leading-relaxed">
                        Bien avant l&apos;Armorial de 1696, les archev&ecirc;ques de Sens scellaient leurs actes avec de magnifiques sceaux en cire.
                        12&nbsp;sceaux (1174&ndash;1335) sont conserv&eacute;s et accessibles en ligne&nbsp;: de Guillaume de Champagne &agrave; Guillaume de Brosse.{" "}
                        <a
                          href="https://sigilla.irht.cnrs.fr/archeveque-sens-268"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-violet-900"
                        >
                          Explorer sur Sigilla (IRHT/CNRS) &rarr;
                        </a>
                      </p>
                    </div>
                  )}

                  {/* Source */}
                  <div className="pt-2 border-t border-stone-100">
                    <p className="text-xs text-stone-400">
                      {selected.source}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Manuscrit consultable sur{" "}
                      <a
                        href="https://gallica.bnf.fr/ark:/12148/bpt6k111473g"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        Gallica / BnF
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
