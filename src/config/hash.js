/**
 * @author hyamamoto //Tradução livre para o português
 * 
 * Função de retorno de hashcode para String
 * (Compatível com a função nativa do Java String.hashCode())
 *
 * O hash code para uma string é calculado como
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * usando aritmética numérica, onde s[i] é a posição da letra
 * da string que foi passada, n é o tamanho da string,
 * e ^ indica a exponenciação (ou potência).
 * (O hashcode para uma string vazia é sempre 0)
 *
 * @param {string} stringToConvert uma string
 * @return {number} um hashcode respectivo a string passada no parâmetro da função
 */

module.exports = (stringToConvert) => {
    for(var index = 0, hash = 0; index < stringToConvert.length; index++)
        hash = Math.imul(31, hash) + stringToConvert.charCodeAt(index) | 0;
    return hash;
}