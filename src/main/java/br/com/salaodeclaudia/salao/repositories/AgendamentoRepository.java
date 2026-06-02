package br.com.salaodeclaudia.salao.repositories;

import br.com.salaodeclaudia.salao.entities.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

}