const validarNumerosParms = (desde = 1, pages = 1, limit = 5) => {

    let numDesde = Number(desde);
    let numPages = Number(pages);
    let numLimit = Number(limit);


    if (numDesde === NaN){

        return res.status(406).json({

            msg: `==> ${desde} <== No es un numero.`,
    
        });
       
    }

    if (numPages === NaN){

        return res.status(406).json({

            msg: `==> ${pages} <== No es un numero.`,
    
        });
        
    }

    if (numLimit === NaN){

        return res.status(406).json({

            msg: `==> ${limit} <== No es un numero.`,
    
        });

    }

};

module.exports = {
    validarNumerosParms
}