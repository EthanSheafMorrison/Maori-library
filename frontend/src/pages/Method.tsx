export function Method() {
  return (
    <div className="space-y-6">
      <header className="card p-6 gradient-bg">
        <h1 className="h1 mb-2">Our Method</h1>
        <p className="text-muted">A comprehensible-input approach to acquiring te reo Māori.</p>
      </header>

      <section className="card p-6 space-y-4">
        <h2 className="h2">Why this works</h2>
        <p>
          We focus on comprehensible input: listening and reading you can mostly understand, so your
          brain naturally acquires vocabulary, grammar, and a feel for the language without heavy
          memorisation. Speaking confidence follows once enough input has built a clear mental model
          of the sounds and patterns of the language.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="font-semibold mb-1">Comprehensible input first</div>
            <div className="text-caption text-muted">Understand messages → acquire forms and patterns implicitly.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold mb-1">Acquisition ≠ study</div>
            <div className="text-caption text-muted">Exposure builds fast, intuitive knowledge; rules stay optional.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold mb-1">Delay output pressure</div>
            <div className="text-caption text-muted">Speak when ready; clear sound targets come from rich input.</div>
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="h2">How to use this app</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-medium">Watch what you understand</span>. Pick topics you know (e.g., kai prep, kapa haka intros, pepeha basics) so kupu like <em>whānau, kura, mahi, kai</em> feel obvious from context.</li>
          <li><span className="font-medium">Use transcripts when helpful</span>. Prefer ones with tohutō (macrons). Skim for patterns like <em>Kei te …</em> (state), location with <em>i/ki</em>, and simple <em>He …</em> sentences.</li>
          <li><span className="font-medium">Log outside input</span>. Add reading/listening done elsewhere in <span className="underline">Progress → Outside hours</span>.</li>
          <li><span className="font-medium">Practice speaking later</span>. When ready, lean on frames like <em>Ko … tōku ingoa</em>, <em>Nō … au</em>, <em>Kei te … au</em> to ease in.</li>
        </ul>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="h2">Māori-specific examples</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="font-semibold mb-1">Useful sentence frames</div>
            <ul className="list-disc pl-5 text-small space-y-1">
              <li><span className="font-medium">Kupu whakatau:</span> Kia ora. Tēnā koe/kōrua/koutou.</li>
              <li><span className="font-medium">Kei te … au:</span> Kei te hiakai au. Kei te ngenge au. Kei te harikoa au.</li>
              <li><span className="font-medium">He … tāku/tōku:</span> He pukapuka tāku. He waka tōku.</li>
              <li><span className="font-medium">Kei … te …:</span> Kei te whare pukapuka te kaiako. Kei te marae te whānau.</li>
              <li><span className="font-medium">Pātai āhua:</span> He aha tēnei? He pene tēnei.</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold mb-1">Starter vocabulary domains</div>
            <ul className="list-disc pl-5 text-small space-y-1">
              <li><span className="font-medium">Whānau:</span> whaea, matua, tuakana, teina, tamariki</li>
              <li><span className="font-medium">Kai:</span> kai, wai, hēki, rēwena, mīti, huawhenua</li>
              <li><span className="font-medium">Wāhi/Mahi:</span> whare, kura, mahi, toa, marae</li>
              <li><span className="font-medium">Wā/Āhua:</span> rangi, raumati, hotoke, makariri, wera</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="font-semibold mb-1">Pronunciation and spelling (tohutō)</div>
          <ul className="list-disc pl-5 text-small space-y-1">
            <li>Long vowels ā, ē, ī, ō, ū change meaning: <em>kaka</em> vs <em>kākā</em>.</li>
            <li><em>wh</em> often sounds like f; <em>r</em> is a tap; <em>ng</em> as in “singer”.</li>
            <li>Prefer content with macrons to reinforce vowel length while reading.</li>
          </ul>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="h2">Input levels (guideline)</h2>
        <p className="text-muted">Approximate cumulative hours of comprehensible input. Your path may vary.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="font-semibold">Level 1</div>
            <div className="text-caption text-muted">0–50 hrs • Get familiar sounds, core words, simple stories.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold">Level 2</div>
            <div className="text-caption text-muted">50–150 hrs • Understand everyday topics with support.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold">Level 3</div>
            <div className="text-caption text-muted">150–300 hrs • Patterns feel natural; light conversation.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold">Level 4</div>
            <div className="text-caption text-muted">300–600 hrs • Broad topics, fewer transcripts needed.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold">Level 5+</div>
            <div className="text-caption text-muted">600+ hrs • Fluent input; reading and speaking expand fast.</div>
          </div>
        </div>
        <div className="accent-box mt-2">Tip: Consistency beats intensity. Aim for daily minutes, not occasional marathons.</div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="h2">FAQ</h2>
        <details className="rounded-lg border p-4">
          <summary className="font-medium">Do I need grammar study?</summary>
          <p className="mt-2 text-muted">Optional. Input builds the intuitions you actually use in real time. Light study can be interesting, but isn’t required to progress.</p>
        </details>
        <details className="rounded-lg border p-4">
          <summary className="font-medium">Will speaking suffer if I don’t practice early?</summary>
          <p className="mt-2 text-muted">No. Clear pronunciation and fluent phrasing follow quickly once your input is strong; early forcing often reinforces L1 habits.</p>
        </details>
        <details className="rounded-lg border p-4">
          <summary className="font-medium">When should I start reading?</summary>
          <p className="mt-2 text-muted">Once listening feels easy at Level 4–5, reading accelerates vocabulary growth without harming pronunciation.</p>
        </details>
      </section>

      <footer className="text-caption text-muted">
        Inspired by approaches popularised by Dreaming Spanish and Sloeful. Ngā mihi.
      </footer>
    </div>
  )
}


