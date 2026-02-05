/**
 * TEST HERO NAME - Incolla nella console (F12)
 */

console.log('=== TEST HERO NAME ===');

// 1. Verifica se GSAP esiste
if (typeof gsap === 'undefined') {
    console.error('❌ GSAP NON CARICATO!');
} else {
    console.log('✅ GSAP caricato:', gsap.version);
}

// 2. Trova l'elemento
const heroName = document.querySelector('.hero-name');
if (!heroName) {
    console.error('❌ Elemento .hero-name NON TROVATO!');
} else {
    console.log('✅ Elemento .hero-name trovato');
    console.log('   Contenuto:', heroName.textContent);
    console.log('   Opacity CSS:', window.getComputedStyle(heroName).opacity);
    console.log('   Transform CSS:', window.getComputedStyle(heroName).transform);
    console.log('   Display CSS:', window.getComputedStyle(heroName).display);
    console.log('   Visibility CSS:', window.getComputedStyle(heroName).visibility);
}

// 3. TEST FORZATO - Prova a mostrare il nome
if (heroName) {
    console.log('\n🔧 TEST: Provo a forzare opacity: 1...');
    heroName.style.opacity = '1';
    heroName.style.transform = 'translateY(0)';
    heroName.style.visibility = 'visible';

    setTimeout(() => {
        const computed = window.getComputedStyle(heroName);
        console.log('   Dopo forzatura - Opacity:', computed.opacity);
        console.log('   Dopo forzatura - Transform:', computed.transform);
        console.log('   SE ORA VEDI IL NOME = il problema è GSAP, non il CSS');
    }, 100);
}

// 4. Verifica se l'animazione GSAP è partita
console.log('\n🔍 Verifica animazioni GSAP...');
const timelines = gsap.globalTimeline.getChildren();
console.log('   Timeline attive:', timelines.length);

// 5. TEST ANIMAZIONE DIRETTA
if (heroName && typeof gsap !== 'undefined') {
    console.log('\n🔧 TEST: Provo animazione GSAP diretta...');
    gsap.to(heroName, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        onComplete: () => {
            console.log('✅ Animazione completata! Il nome dovrebbe essere visibile');
        }
    });
}

console.log('\n=== ISTRUZIONI ===');
console.log('1. Controlla sopra se ora vedi "Mattia Borrelli"');
console.log('2. Apri la console (F12) e leggi i messaggi sopra');
console.log('3. Copia TUTTI i messaggi della console e incollali qui');
