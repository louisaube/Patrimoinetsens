"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Eye, Palette, Shield, Shapes, BookOpen, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// ─── Data ──────────────────────────────────────────────────────────────────

const EMAUX = {
  metaux: [
    { nom: "Or", couleur: "#FFD700", css: "bg-yellow-400", desc: "Jaune — symbolise la générosité, la richesse" },
    { nom: "Argent", couleur: "#F5F5F5", css: "bg-gray-100 border border-gray-300", desc: "Blanc — symbolise la pureté, la sagesse" },
  ],
  couleurs: [
    { nom: "Gueules", couleur: "#DC2626", css: "bg-red-600", desc: "Rouge — symbolise le courage, la hardiesse" },
    { nom: "Azur", couleur: "#2563EB", css: "bg-blue-600", desc: "Bleu — symbolise la loyauté, la justice" },
    { nom: "Sinople", couleur: "#16A34A", css: "bg-green-600", desc: "Vert — symbolise l'espérance, la liberté" },
    { nom: "Sable", couleur: "#1C1917", css: "bg-stone-900", desc: "Noir — symbolise la prudence, la constance" },
    { nom: "Pourpre", couleur: "#9333EA", css: "bg-purple-600", desc: "Violet — symbolise la souveraineté (rare)" },
  ],
}

const PARTITIONS = [
  {
    nom: "Parti",
    desc: "Divisé verticalement en deux. Souvent utilisé pour les couples : à gauche les armes du mari, à droite celles de la femme.",
    svg: (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="#2563EB" stroke="#1C1917" strokeWidth="2" />
        <path d="M40,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Z" fill="#DC2626" />
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="none" stroke="#1C1917" strokeWidth="2" />
      </svg>
    ),
    exemple: "Guillaume Viart (p.52) — parti avec les armes de sa femme Louise Alix",
  },
  {
    nom: "Écartelé",
    desc: "Divisé en quatre quartiers. Permet de combiner les armes de plusieurs familles ou fiefs.",
    svg: (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="#2563EB" stroke="#1C1917" strokeWidth="2" />
        <path d="M40,4 L76,4 Q76,4 76,10 L76,50 L40,50 Z" fill="#FFD700" />
        <path d="M4,50 L40,50 L40,96 Q4,96 4,78 Z" fill="#FFD700" />
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="none" stroke="#1C1917" strokeWidth="2" />
        <line x1="40" y1="4" x2="40" y2="96" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="4" y1="50" x2="76" y2="50" stroke="#1C1917" strokeWidth="1.5" />
      </svg>
    ),
    exemple: "Barthélemy Moutié (p.36) — écartelé d'azur et d'or",
  },
  {
    nom: "Coupé",
    desc: "Divisé horizontalement en deux moitiés.",
    svg: (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="#FFD700" stroke="#1C1917" strokeWidth="2" />
        <path d="M4,50 L76,50 L76,78 Q76,96 40,96 Q4,96 4,78 Z" fill="#DC2626" />
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="none" stroke="#1C1917" strokeWidth="2" />
      </svg>
    ),
    exemple: "Fréquent dans les armoiries ecclésiastiques sénonaises",
  },
  {
    nom: "Au chef",
    desc: "Une bande horizontale occupe le tiers supérieur de l'écu. Très courant : on dit « d'azur au chef d'or ».",
    svg: (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="#2563EB" stroke="#1C1917" strokeWidth="2" />
        <path d="M4,4 L76,4 Q76,4 76,10 L76,34 L4,34 L4,10 Q4,4 10,4 Z" fill="#FFD700" />
        <path d="M10,4 L70,4 Q76,4 76,10 L76,78 Q76,96 40,96 Q4,96 4,78 L4,10 Q4,4 10,4 Z" fill="none" stroke="#1C1917" strokeWidth="2" />
        <line x1="4" y1="34" x2="76" y2="34" stroke="#1C1917" strokeWidth="1.5" />
      </svg>
    ),
    exemple: "Nicolas du Pont de Compiègne (p.44) — chef chargé d'étoiles",
  },
]

const MEUBLES = [
  { nom: "Lion rampant", desc: "Dressé sur ses pattes arrière, griffes en avant. Symbole de force et de courage.", emoji: "🦁", exemples: ["Jean-Baptiste de Brenne", "Philippes de Vormont"] },
  { nom: "Fleur de lys", desc: "Symbole de loyauté envers la couronne. Très fréquent en Île-de-France.", emoji: "⚜️", exemples: ["Louis Godrillat", "Pierre de la Tranche"] },
  { nom: "Aigle", desc: "Symbole d'autorité et de puissance. Souvent « éployé » (ailes déployées).", emoji: "🦅", exemples: ["Guillaume Viart", "Louis Coutellier"] },
  { nom: "Croix", desc: "Symbole de foi. Nombreuses variantes : croix pattée, ancrée, de Malte...", emoji: "✝️", exemples: ["Anne de Perthuis", "Herade de Chavigny"] },
  { nom: "Arbre", desc: "Symbole d'enracinement et de permanence. Souvent « arraché » (racines visibles).", emoji: "🌳", exemples: ["Dominique de Courcelles", "Anne Ambroise le Camus"] },
  { nom: "Étoile", desc: "À 6 branches en héraldique (5 branches = « molette d'éperon »). Symbole d'aspiration.", emoji: "⭐", exemples: ["Nicolas Hurault", "Antoine Nicolas de Vaintange"] },
  { nom: "Chevron", desc: "Pièce en forme de V inversé. Rappelle les chevrons de charpente. Symbole de protection.", emoji: "⛰️", exemples: ["François le Comte", "Jean Nuvert"] },
  { nom: "Fasces", desc: "Bandes horizontales. Trois fasces = « fascé de six pièces ».", emoji: "🏳️", exemples: ["Charles Benoist"] },
]

const QUIZ_QUESTIONS = [
  {
    image: "blason_057_05_Louis_Godrillat.jpg",
    question: "Ce blason montre « D'azur à trois fleurs de lys d'or ». Pourquoi est-il correct selon la règle d'enquerre ?",
    reponse: "Parce qu'il place un métal (or/jaune) sur une couleur (azur/bleu). C'est la combinaison la plus classique de l'héraldique française.",
  },
  {
    image: "blason_044_02_Jean-Baptiste_de_Brenne.jpg",
    question: "Ce blason est « d'argent au lion de sable ». Quelles sont les deux « teintures » utilisées ?",
    reponse: "Argent (métal = blanc) et sable (couleur = noir). Métal sur couleur : la règle est respectée.",
  },
  {
    image: "blason_052_01_Guillaume_Viart.jpg",
    question: "Pourquoi ce blason est-il divisé en deux moitiés distinctes ?",
    reponse: "C'est un blason « parti » : à gauche (dextre) les armes de Guillaume Viart, à droite (senestre) celles de sa femme Louise Alix de Lucat. Cette pratique signale une alliance matrimoniale.",
  },
]

// ─── Components ─────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, titre, id }: { icon: React.ElementType; titre: string; id: string }) {
  return (
    <div id={id} className="flex items-center gap-3 mb-4 pt-8 first:pt-0">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-xl font-serif font-bold text-stone-800">{titre}</h2>
    </div>
  )
}

function ShieldAnatomy() {
  const [active, setActive] = React.useState<string | null>(null)

  const zones: Record<string, { label: string; desc: string }> = {
    chef: { label: "Chef", desc: "Tiers supérieur de l'écu. On dit « au chef de... » pour une pièce placée ici." },
    coeur: { label: "Cœur / Abîme", desc: "Centre exact de l'écu. Les meubles « en cœur » ou « en abîme » y sont placés." },
    pointe: { label: "Pointe", desc: "Base de l'écu. Les meubles « en pointe » sont placés en bas du blason." },
    dextre: { label: "Dextre (gauche)", desc: "Le côté DROIT du porteur du bouclier — donc à GAUCHE quand on regarde. En héraldique, on décrit toujours du point de vue du porteur." },
    senestre: { label: "Senestre (droite)", desc: "Le côté GAUCHE du porteur — donc à DROITE quand on regarde. C'est le côté « moins noble » du blason." },
    canton: { label: "Canton dextre", desc: "Petit carré dans le coin supérieur dextre. Souvent utilisé pour une brisure ou une marque de cadets." },
  }

  const activeZone = active ? zones[active] : null

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <div className="relative w-48 h-56 mx-auto sm:mx-0 flex-shrink-0">
        <svg viewBox="0 0 160 192" className="w-full h-full">
          {/* Shield outline */}
          <path d="M16,8 L144,8 Q152,8 152,16 L152,140 Q152,192 80,192 Q8,192 8,140 L8,16 Q8,8 16,8 Z"
            fill="#F5F0E8" stroke="#78716C" strokeWidth="2" />

          {/* Clickable zones */}
          <rect x="8" y="8" width="144" height="58" rx="8"
            className={`cursor-pointer transition-colors ${active === "chef" ? "fill-emerald-200/80" : "fill-transparent hover:fill-emerald-100/50"}`}
            onClick={() => setActive(active === "chef" ? null : "chef")} />
          <rect x="8" y="66" width="60" height="68"
            className={`cursor-pointer transition-colors ${active === "dextre" ? "fill-emerald-200/80" : "fill-transparent hover:fill-emerald-100/50"}`}
            onClick={() => setActive(active === "dextre" ? null : "dextre")} />
          <rect x="52" y="66" width="56" height="68"
            className={`cursor-pointer transition-colors ${active === "coeur" ? "fill-emerald-200/80" : "fill-transparent hover:fill-emerald-100/50"}`}
            onClick={() => setActive(active === "coeur" ? null : "coeur")} />
          <rect x="92" y="66" width="60" height="68"
            className={`cursor-pointer transition-colors ${active === "senestre" ? "fill-emerald-200/80" : "fill-transparent hover:fill-emerald-100/50"}`}
            onClick={() => setActive(active === "senestre" ? null : "senestre")} />
          <path d="M8,134 L152,134 L152,140 Q152,192 80,192 Q8,192 8,140 Z"
            className={`cursor-pointer transition-colors ${active === "pointe" ? "fill-emerald-200/80" : "fill-transparent hover:fill-emerald-100/50"}`}
            onClick={() => setActive(active === "pointe" ? null : "pointe")} />
          <rect x="8" y="8" width="40" height="30" rx="8"
            className={`cursor-pointer transition-colors ${active === "canton" ? "fill-emerald-200/80" : "fill-transparent hover:fill-emerald-100/50"}`}
            onClick={() => setActive(active === "canton" ? null : "canton")} />

          {/* Labels */}
          <text x="80" y="42" textAnchor="middle" className="fill-stone-500 text-[11px] font-medium pointer-events-none">CHEF</text>
          <text x="32" y="106" textAnchor="middle" className="fill-stone-500 text-[10px] pointer-events-none">DEXTRE</text>
          <text x="80" y="106" textAnchor="middle" className="fill-stone-500 text-[10px] pointer-events-none">CŒUR</text>
          <text x="128" y="106" textAnchor="middle" className="fill-stone-500 text-[10px] pointer-events-none">SENESTRE</text>
          <text x="80" y="168" textAnchor="middle" className="fill-stone-500 text-[11px] font-medium pointer-events-none">POINTE</text>
        </svg>
      </div>

      <div className="flex-1 min-h-[120px]">
        {activeZone ? (
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-bold text-emerald-800 mb-1">{activeZone.label}</h3>
            <p className="text-stone-600 text-sm">{activeZone.desc}</p>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
            <p className="text-stone-500 text-sm italic">
              Cliquez sur une zone de l&apos;écu pour découvrir son nom et sa signification.
            </p>
            <p className="text-stone-400 text-xs mt-2">
              Attention : en héraldique, &quot;dextre&quot; (droite) et &quot;senestre&quot; (gauche) sont inversés par rapport à ce que vous voyez — on décrit toujours du point de vue du porteur du bouclier !
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function QuizCard({ q, index }: { q: typeof QUIZ_QUESTIONS[number]; index: number }) {
  const [revealed, setRevealed] = React.useState(false)
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/armorial/blasons/${q.image}`}
              alt={`Question ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-800 mb-2">{q.question}</p>
            {revealed ? (
              <div className="bg-emerald-50 rounded p-2 border border-emerald-200">
                <p className="text-sm text-emerald-800">{q.reponse}</p>
              </div>
            ) : (
              <button
                onClick={() => setRevealed(true)}
                className="text-sm text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
              >
                <Eye className="w-4 h-4" /> Voir la réponse
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function LireUnBlasonPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-24 pt-4">
      {/* Header */}
      <Link href="/armorial" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Armorial d&apos;Hozier
      </Link>

      <h1 className="text-2xl font-serif font-bold text-stone-800 mb-2">
        Lire un blason
      </h1>
      <p className="text-stone-600 mb-2">
        Guide interactif pour décoder les armoiries de l&apos;Armorial d&apos;Hozier (1696),
        avec des exemples tirés des 94 blasons de l&apos;Élection de Sens.
      </p>
      <p className="text-stone-400 text-sm mb-6">
        L&apos;héraldique est un langage visuel codifié depuis le XII<sup>e</sup> siècle.
        Chaque couleur, chaque figure, chaque position a un nom précis.
        En 5 minutes, vous saurez lire n&apos;importe quel blason.
      </p>

      {/* Table of contents */}
      <nav className="bg-stone-50 rounded-lg p-4 mb-8 border border-stone-200">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Sommaire</p>
        <ol className="space-y-1">
          {[
            { id: "ecu", label: "L'écu et ses parties" },
            { id: "emaux", label: "Les émaux : métaux et couleurs" },
            { id: "enquerre", label: "La règle d'enquerre" },
            { id: "partitions", label: "Les partitions" },
            { id: "meubles", label: "Les meubles (figures)" },
            { id: "decoder", label: "Décoder un blasonnement" },
            { id: "quiz", label: "Testez-vous !" },
          ].map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-sm text-stone-600 hover:text-emerald-700 flex items-center gap-2">
                <span className="text-stone-400 w-4 text-right">{i + 1}.</span>
                <ChevronRight className="w-3 h-3 text-stone-300" />
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. L'écu */}
      <SectionHeader icon={Shield} titre="L'écu et ses parties" id="ecu" />
      <p className="text-stone-600 text-sm mb-4">
        L&apos;écu (le bouclier) est la surface sur laquelle sont peintes les armoiries.
        Sa forme classique rappelle le bouclier médiéval. Chaque zone a un nom précis,
        utilisé dans la description (le &quot;blasonnement&quot;).
      </p>
      <ShieldAnatomy />

      {/* 2. Les émaux */}
      <SectionHeader icon={Palette} titre="Les émaux : métaux et couleurs" id="emaux" />
      <p className="text-stone-600 text-sm mb-4">
        En héraldique, on n&apos;utilise pas de nuances : il n&apos;y a que 7 teintes possibles,
        réparties en deux familles.
      </p>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-stone-700 mb-2">Les métaux (clairs)</h3>
        <div className="grid grid-cols-2 gap-2">
          {EMAUX.metaux.map((e) => (
            <div key={e.nom} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-stone-200">
              <div className={`w-10 h-10 rounded-lg ${e.css} flex-shrink-0`} />
              <div>
                <p className="font-bold text-stone-800 text-sm">{e.nom}</p>
                <p className="text-stone-500 text-xs">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-stone-700 mb-2">Les couleurs (foncées)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EMAUX.couleurs.map((e) => (
            <div key={e.nom} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-stone-200">
              <div className={`w-10 h-10 rounded-lg ${e.css} flex-shrink-0`} />
              <div>
                <p className="font-bold text-stone-800 text-sm">{e.nom}</p>
                <p className="text-stone-500 text-xs">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Règle d'enquerre */}
      <SectionHeader icon={BookOpen} titre="La règle d'enquerre" id="enquerre" />
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <p className="text-amber-900 font-bold text-sm mb-2">La règle fondamentale de l&apos;héraldique :</p>
        <p className="text-amber-800 text-sm mb-3">
          On ne pose jamais <strong>métal sur métal</strong>, ni <strong>couleur sur couleur</strong>.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded p-3 border border-green-200">
            <p className="text-green-700 text-xs font-bold mb-1">✓ Correct</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-yellow-400" />
              </div>
              <p className="text-xs text-stone-600">Couleur (azur) + métal (or)</p>
            </div>
          </div>
          <div className="bg-white rounded p-3 border border-red-200">
            <p className="text-red-700 text-xs font-bold mb-1">✗ Interdit</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-red-600" />
              </div>
              <p className="text-xs text-stone-600">Couleur (azur) + couleur (gueules)</p>
            </div>
          </div>
        </div>
        <p className="text-amber-700 text-xs mt-3">
          Un blason qui viole cette règle est dit &quot;à enquerre&quot; — il faut &quot;enquérir&quot; (demander) pourquoi.
          Le plus célèbre : les armes de Jérusalem (croix d&apos;or sur argent — métal sur métal),
          justifié par le prestige unique de la Ville Sainte.
        </p>
      </div>

      <p className="text-stone-500 text-sm mb-4">
        Dans notre Armorial sénonais, cette règle est systématiquement respectée :
        les lions sont d&apos;or sur gueules, les fleurs de lys d&apos;or sur azur,
        les aigles de sable sur or...
      </p>

      {/* 4. Les partitions */}
      <SectionHeader icon={Shapes} titre="Les partitions" id="partitions" />
      <p className="text-stone-600 text-sm mb-4">
        L&apos;écu peut être divisé en plusieurs zones, chacune avec ses propres couleurs et figures.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {PARTITIONS.map((p) => (
          <div key={p.nom} className="text-center">
            <div className="w-16 h-20 mx-auto mb-2">{p.svg}</div>
            <p className="font-bold text-stone-800 text-sm">{p.nom}</p>
            <p className="text-stone-500 text-xs">{p.desc}</p>
            <p className="text-emerald-600 text-xs mt-1 italic">{p.exemple}</p>
          </div>
        ))}
      </div>

      {/* 5. Les meubles */}
      <SectionHeader icon={Shield} titre="Les meubles (figures)" id="meubles" />
      <p className="text-stone-600 text-sm mb-4">
        Les &quot;meubles&quot; sont les figures placées sur l&apos;écu : animaux, plantes, objets, figures géométriques.
        Voici les plus fréquents dans l&apos;Armorial sénonais de 1696 :
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {MEUBLES.map((m) => (
          <div key={m.nom} className="flex gap-3 bg-white rounded-lg p-3 border border-stone-200">
            <span className="text-2xl flex-shrink-0">{m.emoji}</span>
            <div>
              <p className="font-bold text-stone-800 text-sm">{m.nom}</p>
              <p className="text-stone-500 text-xs mb-1">{m.desc}</p>
              <div className="flex flex-wrap gap-1">
                {m.exemples.map((ex) => (
                  <Badge key={ex} variant="outline" className="text-xs text-emerald-700 border-emerald-300">
                    {ex}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Décoder un blasonnement */}
      <SectionHeader icon={BookOpen} titre="Décoder un blasonnement" id="decoder" />
      <p className="text-stone-600 text-sm mb-4">
        Un blasonnement se lit toujours dans le même ordre. Prenons un exemple réel
        de notre Armorial sénonais :
      </p>

      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/armorial/blasons/blason_057_05_Louis_Godrillat.jpg"
                alt="Blason de Louis Godrillat"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <p className="font-bold text-stone-800 mb-1">Louis Godrillat</p>
              <p className="text-stone-400 text-xs mb-3">Armorial d&apos;Hozier, p.57</p>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">1. Champ</Badge>
                  <p className="text-sm text-stone-600"><strong>&quot;D&apos;azur...&quot;</strong> — le fond de l&apos;écu est bleu</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-yellow-500 text-stone-800 text-xs flex-shrink-0">2. Meuble</Badge>
                  <p className="text-sm text-stone-600"><strong>&quot;...à trois fleurs de lys...&quot;</strong> — trois fleurs de lys sont posées sur le champ</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-yellow-400 text-stone-800 text-xs flex-shrink-0">3. Émail</Badge>
                  <p className="text-sm text-stone-600"><strong>&quot;...d&apos;or&quot;</strong> — les fleurs de lys sont jaunes (métal sur couleur ✓)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 mb-4">
        <p className="text-stone-700 text-sm font-medium mb-2">L&apos;ordre de lecture d&apos;un blasonnement :</p>
        <ol className="text-sm text-stone-600 space-y-1 list-decimal list-inside">
          <li><strong>Le champ</strong> (fond) — toujours en premier : &quot;D&apos;azur...&quot;, &quot;De gueules...&quot;</li>
          <li><strong>Le meuble principal</strong> — &quot;...au lion...&quot;, &quot;...à trois fleurs de lys...&quot;</li>
          <li><strong>Son émail</strong> — &quot;...d&apos;or&quot;, &quot;...d&apos;argent&quot;</li>
          <li><strong>Les accompagnements</strong> — &quot;...accompagné de deux étoiles de...&quot;</li>
          <li><strong>Le chef / bordure</strong> — &quot;...au chef de gueules chargé de...&quot;</li>
        </ol>
      </div>

      {/* 7. Quiz */}
      <SectionHeader icon={HelpCircle} titre="Testez-vous !" id="quiz" />
      <p className="text-stone-600 text-sm mb-4">
        Mettez en pratique ce que vous avez appris avec ces blasons de l&apos;Élection de Sens :
      </p>
      <div className="space-y-3 mb-8">
        {QUIZ_QUESTIONS.map((q, i) => (
          <QuizCard key={i} q={q} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-emerald-50 rounded-lg p-6 border border-emerald-200">
        <p className="text-emerald-800 font-serif font-bold mb-2">
          Explorez les 94 blasons du Sénonais
        </p>
        <p className="text-emerald-600 text-sm mb-4">
          Maintenant que vous savez lire un blason, parcourez l&apos;Armorial d&apos;Hozier
          et décodez les armoiries des familles, chanoines et institutions de Sens en 1696.
        </p>
        <Link
          href="/armorial"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors text-sm font-medium"
        >
          <Shield className="w-4 h-4" /> Voir l&apos;Armorial
        </Link>
      </div>
    </div>
  )
}
