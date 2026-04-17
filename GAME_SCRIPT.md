# AIDA — GAME SCRIPT

Every line of text the player will see: the card pages (David's handwritten
intros / outros), in-scene narration, every speech bubble, every multiple-
choice option with its branching responses, and every text-message thread.

Edit this file freely, send it back, and the code will be updated to match.

---

## Notation

```
CARD                a page of the birthday card (David's handwriting)
SCENE               what plays after the reader turns the page
(narration)         top narration strip  — David narrating the memory
Aida:               spoken line — speech bubble over Aida
(Aida — thought)    inner monologue — purple thought bubble over Aida
David:              spoken line — speech bubble over David
Lisa: / Maha: ...   other characters speaking
PHONE               text-message overlay — me = Aida, them = David
[button label]      a minigame button (e.g. shot, cigarette puff)
[Choice option]     multiple-choice option shown in Aida's bubble
  → David: ...      line that plays after that choice
```

---

# TITLE CARD

## Cover

```
    💜
    Happy
    Birthday,
    Aidka
    a little note from David

    [ Open ]
```

## Inside (David's opening note)

```
Aidka —

Happy birthday.

I wrote you a little thing. Just a card with
a lot of pages — every memory from the nights between
Dec 31 and Jan 7. Silver pants included.

If I forgot anything important, it's in there
somewhere. Probably behind a piano.

I love you.

— David 💜

[ Next page → ]
```

---

# CHAPTER I — A Goth on the Stairs

*December 2024*

## CARD (intro)

```
I remember the first time I saw you.

Lisa's mother's birthday. A back room at Balagan —
cigarettes, perfume, music through the ceiling. You
were sitting on the couch like you didn't want to
be seen.

I walked in and said the worst line of my life.

You laughed anyway.

[ Next page → ]
```

## SCENE — the back room at Balagan

```
(Aida — thought)  (Music through the ceiling.)
(Aida — thought)  (Lisa's mom's birthday.)
(Aida — thought)  (You're already here.)

(Aida — thought)  (Light one. Just a couple of pulls.)

[🚬 Puff × 3]   (cigarette-puff minigame)

— David walks in through the door on the right.
— Lisa runs up to him, hugs him.

Lisa:   DAVID! You made it.
(narration)  He hugs her. She hugs him harder.
Lisa:   Everyone — this is my favourite person in the world.
David:  She says that to everyone.
Lisa:   I don't. Just you.

======= THE FIRST LOOK (spotlight moment) =======
— Music stops. The whole room goes dark.
— Two tight spotlights fall on Aida and David only.
— An angelic violin/harp rises.

(Aida — thought)  (Oh. The most beautiful person.)
(David — thought) (… wow. Who is she?)

— Hearts bloom around both of them.
— Spotlights fade. Music returns.

======= DAVID APPROACHES MAHA =======

David:  Maha, right? Is that short for Rasomaha? Like the Wolverine?
Maha:   No one's ever asked me that.
David:  It was on the tip of my tongue since I walked in.

Lisa:   By the way — David was too greedy to buy me a COOKIE in Israel.
David:  It was a small cookie!
Lisa:   It was NOT.
Maha:   Knew it. Figured.

======= DAVID SITS BESIDE AIDA ON THE COUCH =======

???:    …
David:  Are you a goth?

Aida:   What did you just say to me?
  [ Are you serious? ]
    → David:  I mean — the dress. Sorry. I'm bad at this.
  [ Unbelievable. Hi. ]
    → David:  Hi. I'm — yeah, I'm bad at this.
  [ Do I look like a goth to you? ]
    → David:  Honestly? A little. In the best way.

(narration)  You laugh. Not at him — almost with him.

======= MAHA RUNS INTERFERENCE =======

— Maha walks over.

Maha:   So, David. What do you do for a living?
David:  A bit of everything. Some product, some code, some art.
Maha:   Hmm. Won't work for us.
(Aida — thought)  (Maha. Do NOT.)
Maha:   Are you close with your mother?
David:  Yeah. Very.
Maha:   Hmm. Won't work for us.
(Aida — thought)  (MAHA. I will end you.)
Maha:   Last one. If you met a girl tonight — goth or otherwise — what would you do?
David:  I... don't know. Figure it out?
Maha:   Hmm. — That WILL work for us.
David:  Wait — what changed?
Maha:   Nothing. Never mind.
(Aida — thought)  (He saw me blush. That's how he knew.)
```

## CARD (outro)

```
(You were laughing before you could stop yourself. I saw it.)

I didn't know what you were then. I only knew I wasn't going to forget your face.

[ Next page → ]
```

---

# CHAPTER II — Silver Pants

*New Year's Eve, 2024*

## CARD (intro)

```
A few nights later — the same club, a different room.

I wore silver pants. You pretended this was normal.
We didn't say a word to each other.

I thought about you the whole countdown.

[ Next page → ]
```

## SCENE — NYE at Balagan

```
(Aida — thought)  (New Year's at Balagan. The room is all elbows and laser.)
(narration)       In SILVER pants. Actual silver pants — catching every laser in the room.
(Aida — thought)  (Neither of you is talking. Neither of you needs to.)

Lisa:   Shots before the countdown. Everyone!

[🥃 Shot × 4]   (shots minigame — clink with David)

(narration)  He clinks his glass against yours. You down them together.

======= COUNTDOWN =======
(Aida — thought)  (The clock on the wall reads 23:59:50. Everyone turns.)

— Giant screen across the top counts down:
  10  →  9  →  8  →  7  →  6  →  5  →  4  →  3  →  2  →  1
— 🎉  HAPPY NEW YEAR  🎉
— Firework music notes bloom around the dance floor.

(narration)  A song shifts. He raises his glass — then he's gone.

— David drifts into the crowd and vanishes.

(Aida — thought)  (You look for him. The crowd closes. You let it.)

— Fade to black.
```

## PHONE — "morning after" (text messages)

| Time  | From   | Text                                                |
| ----- | ------ | --------------------------------------------------- |
| 7:36  | David  | Hey                                                 |
| 7:36  | David  | I left 🥸                                           |
| 13:02 | Aida   | Hey                                                 |
| 13:02 | Aida   | Figured                                             |
| 13:03 | David  | Good end to the night?                              |
| 17:32 | Aida   | Yeah, everyone survived                             |
| 17:32 | Aida   | You?                                                |
| 20:08 | David  | Fine. Woke up energetic                             |
| 20:08 | David  | But slept forever                                   |
| 20:54 | Aida   | I'm still exploiting your pearl necklace btw        |
| 21:23 | David  | Wow                                                 |
| 21:24 | David  | Exploiter.                                          |
| 21:24 | David  | Is that your new look for 2025?                     |

## CARD (outro)

```
(I drank too much and lost you in the crowd.)

I wrote to you from the taxi home. You wrote back at one in the afternoon, already awake. I read it twice.

[ Next page → ]
```

---

# CHAPTER III — Lisa's Place

*A few nights later*

## CARD (intro)

```
Lisa's flat on Patriki. A film with the sound off.
A bottle of wine on the table and the lamp turning
everything red.

You and me, finally, with nothing to do but talk.

I asked about your favourite movie. I already knew the answer.

[ Next page → ]
```

## SCENE — Lisa's apartment

```
Lisa:   Drinks. Film. I'll sit over here and pretend not to watch you two.
David:  So — what's your favourite movie?

Aida:   (Easy.)
  [ The Lord of the Rings. ]
    → David:  Lord of the Rings. — Cool.
    → (Aida — thought)  (He said it like he meant it.)
  [ Solaris. ]
    → David:  Good answer. — Mine is Lord of the Rings, actually.
  [ Something with Audrey Hepburn. ]
    → David:  Good answer. — Mine is Lord of the Rings, actually.

David:  Can I read your cards? I brought a deck.

Aida:   (A tarot reading. On the second meeting.)
  [ Read them. ]
  [ Only if you're good. ]

(narration)  He shuffles. Deals three. Looks at them. Looks at you.
David:       The Lovers. The Star. The Fool.
(Aida — thought)  (That can't be a coincidence.)

David:  Okay — I name something, you tell me if you love it or hate it.
        Then I'll guess yours.

——— 4 QUICK ROUNDS (Q from David, A from Aida) ———

David:  Frodo or Aragorn?
Aida:   …
  [ Frodo. ]
    → Aida:  Oh — fine, we'll argue about this later.      (wrong)
  [ Aragorn. ]  ←  correct
    → Aida:  Knew it. Ranger energy.                       (right)

David:  A quiet Sunday — Klimt or Schiele?
Aida:   …
  [ Klimt, please. ]
    → Aida:  Alright, noted. Klimt works too.              (wrong)
  [ Schiele. Always Schiele. ]  ←  correct
    → Aida:  The nerves. The hands. Of course.             (right)

David:  Album on repeat — Mills Brothers or Guns N' Roses?
Aida:   …
  [ Mills Brothers. ]
    → Aida:  Jazz it is. I'll learn.                       (wrong)
  [ Guns N' Roses. ]  ←  correct
    → Aida:  Metalhead energy. Approved.                   (right)

David:  Moscow winter — stay in or go to Patriki?
Aida:   …
  [ Stay in, with a book. ]  ←  correct
    → Aida:  Same. The book wins.                          (right)
  [ Patriki, with coffee. ]
    → Aida:  Patriki it is — I know a place.               (wrong)

— If score ≥ 3:
  (narration)  He watches you longer than necessary. You don't look away.
— Else:
  (narration)  He laughs. He actually laughs. That's new.
```

## CARD (outro)

```
(Same films. Same painters. The same way of going quiet when a song you love comes on.)

I shuffled the cards and dealt three. I swear I didn't cheat.

[ Next page → ]
```

---

# CHAPTER III½ — Dinner, Before the Pharmacy

*Later that same night*

## CARD (intro)

```
Then a long table off Nikitskaya. Lisa and Katya across,
Maha at the head, the two of us sitting too close on
the same side.

Your shoulder kept bumping mine. Neither of us moved away.

You kept saying you were fine. You weren't.

[ Next page → ]
```

## SCENE — the restaurant

```
Lisa:   Are you two starting to come down with something? You look flushed.
(Aida — thought)  (Your throat is glass. You're fine. You're fine.)
Katya:  Shots. Shots are the cure. Everyone knows.
Maha:   (Pours one. Slides it toward you.)

[🥃 Vodka × 3]   (shots minigame — "you insist you're fine")

— Blush hearts spawn on Aida AND David with each shot.

(Aida — thought)  (Your face is hot. His too. You can tell.)
David:            (He leans in, whispers.)  You okay? You're shaking.
Aida:             I'm fine. I'm a LIAR. I'm fine.
David:            The pharmacy's only two blocks. Let's step out — I'll walk you.
Lisa:             Go, go. We'll hold the table.
```

## CARD (outro)

```
(The shots didn't work. I could see it in your face.)

I put on my coat. I told you the pharmacy was two blocks over — mostly as an excuse to get you outside with me.

[ Next page → ]
```

---

# CHAPTER IV — The Pharmacy Walk

*The walk to the pharmacy*

## CARD (intro)

```
We went out into the snow. Bolshaya Nikitskaya was empty.
Yellow streetlamps, old buildings, one or two cars going past.

The pharmacy was at number thirteen. I had no idea if it
would be open.

You were so quiet. Your hand was cold.

[ Next page → ]
```

## SCENE — Bolshaya Nikitskaya 13, winter night

```
— Snow falls in slow drifts across the whole street.
— David trails one tile behind Aida as she walks east.

(Aida — thought)  (Your throat is glass. The vodka didn't help.)
David:            Come on — I'll walk you. Two blocks.

——— Lamp 1 ———
David:  You alright? You're a bit quiet.
Aida:   I'm fine. I'm always fine. It's a trick.

——— Lamp 2 ———
(narration)       Puts a hand on your back. Then your neck. Quiet.
(Aida — thought)  (Not expected. Not unwelcome.)
— Purple heart spawns.

——— The pharmacy door (13) ———
David:            — of course it's closed.
(Aida — thought)  (You laugh. It hurts your chest.)
David:            Come on. I'll walk you back.

——— Walk back home ———
— David trails one tile to her RIGHT now.

David:            I should have checked the hours before we walked.
Aida:             You wanted to get me out of there.
David:            … yeah. I did.
— Heart spawns.
```

## CARD (outro)

```
(Closed. Of course it was closed.)

On the walk back I put my hand on your back, then your neck. You didn't move away. By the time we got inside, you were burning up.

[ Next page → ]
```

---

# CHAPTER V — Forty Degrees

*Three days, one screen*

## CARD (intro)

```
You went home to Presnya. Forty of fever. The flat
quiet, the phone the only light in the room.

For three days we only had each other through a screen.

You promised me you'd stop believing in magic if it
didn't break by Sunday.

[ Next page → ]
```

## SCENE — split-screen bedrooms

```
— LEFT: Aida in her parents' flat on Presnya, in bed.
— RIGHT: David in his bedroom (dark-wood bed, grey-blue
         bedding, nightstand with a blue bottle, dark bookshelf).

(Aida — thought)  (Fever of 40. Everything tastes like paper.)
(Aida — thought)  (Your phone buzzes.)

— Phone thread appears full-screen.
```

## PHONE — three days of texts

| Time  | From   | Text                                                  |
| ----- | ------ | ----------------------------------------------------- |
| 00:18 | David  | Alive?                                                |
| 00:18 | David  | You held up well                                      |
| 01:22 | Aida   | No                                                    |
| 01:22 | Aida   | It's hell                                             |
| 01:22 | Aida   | I have a fever of 40. Can you believe it              |
| 01:24 | David  | God                                                   |
| 01:26 | Aida   | I don't understand how I was dancing at all           |
| 01:27 | David  | It was magical Jewish energy keeping you up           |
| 01:27 | Aida   | If it doesn't pick me up in 2 days                    |
| 01:27 | Aida   | I will never believe in magic again                   |
| 13:20 | David  | Hi hi. How are you feeling?                           |
| 16:18 | Aida   | A little better                                       |
| 23:38 | David  | When you recover — Coldrex, then straight to Secret   |
| 23:43 | Aida   | I think I need a couple more days                     |
| 23:44 | Aida   | And then straight                                     |
| 23:44 | Aida   | To Secret                                             |
| 02:38 | Aida   | It's all your metallic pants                          |
| 03:06 | David  | They really helped over there                         |
| 02:36 | Aida   | You're just waiting for me to recover                 |
| 02:36 | Aida   | so we can go to Secret, aren't you?                   |
| 02:47 | David  | Your health is my top priority                        |
| 02:47 | Aida   | Like 💙                                                |
| 15:28 | Aida   | Davidka                                               |
| 15:44 | David  | Aidka                                                 |
| 15:44 | David  | And Davidka                                           |
| 15:44 | David  | Sounds good                                           |

## CARD (outro)

```
(It broke. You got up. You called me Davidka for the first time.)

There was one thing left to do — find each other in a room, not through glass.

[ Next page → ]
```

---

# CHAPTER VI — Mo Bar

*The first date*

## CARD (intro)

```
The plan was Secret. We landed at Mo Bar instead.

Mirrored walls, one DJ playing for absolutely nobody,
the colour of the lights the kind a child picks when
they're happy.

Our first date — just us, as if the whole room had
been waiting.

[ Next page → ]
```

## SCENE — Mo Bar

```
(Aida — thought)  (The room is empty. One DJ. Just us.)

— Aida walks to the table (disco-ball lights drifting overhead).
— Two purple hearts along the way to collect.

David:  I picked somewhere quiet. Figured you'd hate a crowd on a first date.

Aida:   That's either very sweet or very suspicious.
  [ Sweet. ]
    → David:  Good. I was aiming for sweet.
  [ Suspicious. ]
    → David:  Fair. I'd suspect me too.
  [ Both. Definitely both. ]
    → David:  Honestly? Both. Let's order.

Aida:   My favorite book. There's a character in it who is like a nerve — one that's too sensitive.
Aida:   That's me.
David:  Me too. In my own way.

Aida:   Let's go to Secret.
David:  Yes — but we've got dinner leftovers. Let me drop them at my place first.
(Aida — thought)  (Your place. Right.)
```

## CARD (outro)

```
(You told me about the character in your favourite book. The one who was a nerve too sensitive. You said that's you.)

I thought: that's me too, in my own way. I told you we had leftovers to drop off at mine.

[ Next page → ]
```

---

# CHAPTER VII — His Apartment

*The long evening at mine*

## CARD (intro)

```
You came up for one minute. Just to drop the food.

There was a guitar on the couch. A piano in the corner.
The TV across the room. The Christmas tree still blinking.

We didn't leave for hours.

[ Next page → ]
```

## SCENE — Act 1: Guitar on the right couch  (lamp-glow lighting)

```
David:  Come in. Just dropping the food. — unless you want to hear something first?

(Aida — thought)  (He's got the guitar in his lap already.)
  [ Sit by him. ]
  [ I'm listening. ]

— Aida walks to the floor tile next to the right couch.
— She sits (sprite swap), facing David.

(narration)  He cracks his knuckles, tunes a string, looks at you once. Starts to play.

— SPOTLIGHT: the room dims, only David is lit up playing guitar.
— "Sweet Child O' Mine" intro, music notes float above the couch.
— Lights come back up, lamp-glow returns.

(Aida — thought)  (You look at him differently. You can't help it.)

— Heart spawns on Aida.
```

## SCENE — Act 2: Piano (Aida LEFT, David RIGHT)

```
David:  One more. — Come sit at the piano.

— David walks from the couch to the right piano seat (col 9).
— Aida walks up to the left piano seat (col 7), sits.

— (If Aida walks past the katana on the way:)
(Aida — thought)  (A real katana. Of course he has a real katana.)

Aida:   Play the one we sang in the car.
David:  "I Think I'm in Love with My Best Friend"? You're dangerous.

— "I Think I'm in Love with My Best Friend" plays on piano.

(narration)  You sang the second verse with him. Neither of you mentioned it after.

(narration)  He reaches for the leg of your chair and slides it closer. Closer.

— Aida slides one tile right (col 8) — shoulder-to-shoulder with David now.

(narration)       He's looking at you instead of the keys. He leans in.
(Aida — thought)  (You turn your cheek. Say thank you.)
Aida:             Thank you.
David:            I'm not trying anything. I promise.
```

## SCENE — Interlude

```
— Fade to black.
— Text appears: "— later that night —"
— Scene effect swaps from LAMP GLOW → MOODY NIGHT (TV blue + Christmas tree red/green).
```

## SCENE — Act 3: TV + Shots + Dance + FINAL KISS (top-left)

```
— David walks down from the piano to the bottom couch and sits.

David:  Turn on the TV. There's a playlist queued.

— Aida walks over to the TV (col 2, row 6).

(Aida — thought)  (The Mills Brothers. Of course.)
  [ Press play. ]
  [ ▶ Play the real thing on YouTube. ]
    → (opens YouTube search for "mills brothers till then" in a new tab)

David:  Wait — one more shot first. It's the rule.

[🥃 Shot × 2]   (clink with David)

(Aida — thought)  (Warm. Honest. A little brave.)

— "Till Then" plays. Dance loop starts.

David:  Come here.

— David walks from the bottom couch up to the rug centre (col 8, row 7).
— Aida walks to (col 7, row 7) — they face each other on the rug.

(narration)  He puts a hand on your waist. You put yours on his shoulder. You sway.
— Music notes float around them.

Aida:   This is stupid.
David:  Yeah.

(Aida — thought)  (It's now or another song.)
  [ Keep dancing. ]
    → (Aida — thought)  (One more turn. One more. Okay — now.)
    → (extra 4 music notes, 1s of swaying)
  [ Finally kiss David. ]

— BOTH walk to the TOP-LEFT corner (Aida at 2,1 ; David at 3,1).

(narration)       Your back's against the wall. His hand's on your jaw.
(Aida — thought)  (She kisses him.)

— Fireworks (4 bursts) bloom in the top-left corner.
— 20 hearts cascade across the screen.
```

## CARD (outro)

```
(Guitar. Piano. A cheek, a thank-you, and then later — the record.)

The Mills Brothers. The rug. A kiss against the wall.

And then someone knocked.

[ Next page → ]
```

---

# CHAPTER X — The Knock

*Still that same night*

## CARD (intro)

```
The record got to the end of its side and the room
went quiet.

Then three thumps at the door.

Neither of us had invited anybody.

[ Next page → ]
```

## SCENE — the apartment, moody-night lighting (TV + tree glow)

```
— THREE knocks on the door.
(Aida — thought)  (… what was that?)
— TWO more knocks.
David:            Someone's at the door. At this hour.
(Aida — thought)  (Walk to the door.)

— Aida walks to the door at (1, 8).

— Lisa appears in the doorway and steps into the room.

Lisa:   Guys… I came from the club… something's wrong…
(Aida — thought)  (Her skin. Her eyes. She's not right.)

— Lisa stumbles another step closer.

Lisa:   I don't feel… I don't feel like… me.

======= DRAMATIC TRANSFORMATION =======
— Music cuts out.
— Spotlight on Lisa alone.
— Groan sound. Shake (magnitude 4).
— Groan sound. Shake (magnitude 6).
— BOOM. Lisa's sprite swaps to BIG MONSTER (32×48).
— Shake (magnitude 8).
— Spotlight releases.

Lisa (monster):   RRRGGGHHHHHHH — AIIIIIDDAAAAA…
(Aida — thought)  (She's TWICE her size. Get close. Click her to strike.)

======= COMBAT — 6 hits =======
— Monster AI: chases Aida but stops ONE tile adjacent (never on her).
— 25 % chance each tick she lurches to a random floor tile (destruction).
— Every 1.5 s she spits a gout of fire (ember + smoke particles) toward Aida.
— Each hit: swing sfx + hit sfx + 3 blood bursts + scaling screen shake.
— David also sprays an assist burst from where he stands.

— After 6 hits: BOOM, firework, Lisa removed.

(narration)  She's down. He's at your side.
Aida:        Did that just happen?
David:       Every good story needs a monster.

— Final fireworks (5 bursts across the screen over 2 s).
— Fade to black.
— Fade-text: "— Happy Birthday, Aida. —"
```

## CARD (outro / final message)

```
(Every fairy tale has a monster. We took turns with ours.)

The room went quiet again. The tree kept blinking.

We were both fine. We were both here.

[ Next page → ]
```

---

# CREDITS (after the final card)

```
                     for Aidka

                       Cast
                       Aida
                      David
              Lisa  —  keeper of Balagan
              Maha  —  (not the Wolverine)
  The Mills Brothers  —  playing somewhere else

                      Places
             Balagan  —  the back room
      Balagan  —  the dance floor, New Year's
                A flat on Patriki
              Bolshaya Nikitskaya 13
            Presnya  —  a room with a fever
           Mo Bar  —  mirrored, empty, ours
          Our place, with a Christmas tree

                    Soundtrack
                Sweet Child O' Mine
     I Think I'm in Love with My Best Friend
           Till Then  —  the Mills Brothers,
            somewhere else, in your memory

                    With love
        to Aida  —  for "are you serious"
                and laughing anyway.
                For "this is stupid"
                    and the kiss.
              And every day since.

                    — David 💜
```

---

## Editing notes

- Keep the bracketed-choice format (`[ … ]`) and the arrow-response format (`→ David: …`) when you edit choices — that's what the code looks for.
- Parenthesised lines starting with `(` are treated as inner thought or narration. If you want one to be a normal spoken line instead, strip the opening `(`.
- Don't worry about character limits — the text-box will wrap automatically.
- `(narration)` and `(Aida — thought)` labels are guides for *where* the line appears. You don't need to keep those labels in edits; just make clear who's speaking.
