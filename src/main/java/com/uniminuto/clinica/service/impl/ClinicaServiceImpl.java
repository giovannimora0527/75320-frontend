package com.uniminuto.clinica.service.impl;

import com.uniminuto.clinica.model.RespuestaRs;
import com.uniminuto.clinica.service.ClinicaService;
import org.springframework.stereotype.Service;

/**
 *
 * @author lmora
 */
@Service
public class ClinicaServiceImpl implements ClinicaService {

    @Override
    public RespuestaRs test() {
        RespuestaRs rta = new RespuestaRs();
        rta.setMessage("HOOLAAAAAAAAAAAAAAAAA MUNDOOOOOOOOOOOOOOO");

        return rta; 
    }
    
}
