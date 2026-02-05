/**
 * TEST DIRETTO - Incolla questo nella console del browser
 */

console.log('=== TEST 3D CARD START ===');

// 1. Verifica se le card esistono
const cards = document.querySelectorAll('.featured-project-card');
console.log(`📍 Trovate ${cards.length} card con classe .featured-project-card`);

if (cards.length === 0) {
    console.error('❌ NESSUNA CARD TROVATA! Controlla le classi nell\'HTML');
} else {
    // 2. Testa la prima card
    const firstCard = cards[0];
    console.log('📍 Prima card:', firstCard);

    // 3. Applica un transform di test
    console.log('📍 Applicando transform di test...');
    firstCard.style.transform = 'translate3d(0, 0, 0) rotateX(20deg) rotateY(20deg) scale3d(1.1, 1.1, 1.1)';
    console.log('✅ Transform applicato! La card dovrebbe essere inclinata ORA');

    // 4. Verifica il CSS applicato
    const computedStyle = window.getComputedStyle(firstCard);
    console.log('📍 CSS transform:', computedStyle.transform);
    console.log('📍 CSS perspective:', computedStyle.perspective);
    console.log('📍 CSS transform-style:', computedStyle.transformStyle);

    // 5. Verifica se ci sono event listeners
    console.log('📍 Verifica event listeners...');

    // 6. Aggiungi un listener di test
    firstCard.addEventListener('click', () => {
        console.log('✅ CLICK FUNZIONA! La card riceve eventi');
        alert('CLICK FUNZIONA! Il JavaScript sta funzionando.');
    });

    console.log('=== ISTRUZIONI ===');
    console.log('1. La prima card dovrebbe essere inclinata a destra');
    console.log('2. Clicca sulla prima card per testare se gli eventi funzionano');
    console.log('3. Passa il mouse sulla prima card e guarda la console');
}

// 7. Test del sistema 3D completo
console.log('\n=== TEST SISTEMA 3D ===');
const card3D = window.__portfolioContexts?.card3D;
if (card3D) {
    console.log('✅ Sistema 3D inizializzato:', card3D);
    console.log('📍 Card trovate dal sistema:', card3D.cards.length);
} else {
    console.error('❌ Sistema 3D NON inizializzato! Controlla main.js');
}

console.log('=== TEST 3D CARD END ===\n');
