/*
  Add multiple cards to the db
*/

db.flashcards.update(
  { user: "noe1" },
  {
    $push:
    {
      cards:
      {
        $each:
        [
          {
            front: "what up, new card ",
            back: "new card for the back",
            countID: 2
          },
          {
            front: "new new new three ",
            back: "new new back back",
            countID: 3
          }
        ],
        $sort: { count: 1 }
      }
    }
  }
);


/*
  Push one card into the deck.
*/

db.flashcards.update(
  { owner: "noe1", subject: "CS" },
  {
    $push:
    {
      cards:
      {
        front: "Who was responsible for the Apollo missions software?",
        back: "Margrette Hamilton",
        countID: 3
      }
    }
  }
);

/*
  Sort by cardID
*/
db.flashcards.update(
   { owner: "noe1", subject: "test test test" },
   { $push: { cards: { $each: [], $sort: { countID: 1 } } } }
);

/*
  Insert into the collection (flashcards)
*/

db.flashcards.insert(
{
  _id: "noe1",
  owner: "noe1",
  subject: "CS",
  cards:
  [
    {
      front: "front area",
      back: "back area",
      cardID: 1
    }
  ]
}
);
















