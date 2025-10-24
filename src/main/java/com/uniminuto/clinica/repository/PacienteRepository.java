package com.uniminuto.clinica.repository;

import com.uniminuto.clinica.entity.Paciente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer>{
    
    Optional<Paciente> findByNumeroDocumento(String documento);
    
    List<Paciente> findAllByOrderByFechaNacimientoAsc();

    List<Paciente> findByGenero(String genero);
}
