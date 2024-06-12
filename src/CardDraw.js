import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const CardDraw = () => {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const deckIdRef = useRef(null);

    useEffect(() => {
        async function fetchDeck() {
            const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            setDeck(res.data);
            deckIdRef.current = res.data.deck_id;
        }
        fetchDeck();
    }, []);

    const drawCard = async () => {
        if (deck && deck.remaining > 0) {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckIdRef.current}/draw/?count=1`);
            setCards(cards => [...cards, ...res.data.cards]);
            setDeck(deck => ({ ...deck, remaining: res.data.remaining }));
        } else {
            alert("Error: no cards remaining!");
        }
    };

    const shuffleDeck = async () => {
        setIsShuffling(true);
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckIdRef.current}/shuffle`);
        setDeck({ ...deck, remaining: 52 });
        setCards([]);
        setIsShuffling(false);
    };

    return (
        <div>
            <button onClick={drawCard} disabled={isShuffling}>Draw Card</button>
            <button onClick={shuffleDeck} disabled={isShuffling}>Shuffle Deck</button>
            <div>
                {cards.map(card => (
                    <img key={card.code} src={card.image} alt={card.value + " of " + card.suit} />
                ))}
            </div>
        </div>
    );
};

export default CardDraw;