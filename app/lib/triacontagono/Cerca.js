class Cerca {

    constructor(nome, lado, id) {
        this.nome = nome;
        this.lado = lado;
        this.id = id;
    }
 
    area() {
        const pi = Math.PI;
        const area = (30 * this.lado * this.lado) / (4 * (1 / Math.tan(pi / 30)));
        return area.toFixed(2);

    }

}

module.exports = Cerca;