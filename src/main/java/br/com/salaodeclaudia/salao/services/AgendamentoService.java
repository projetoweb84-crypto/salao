package br.com.salaodeclaudia.salao.services;

import br.com.salaodeclaudia.salao.entities.Agendamento;
import br.com.salaodeclaudia.salao.repositories.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public Agendamento salvar(Agendamento agendamento) {
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id).orElse(null);
    }

    public void deletar(Long id) {
        agendamentoRepository.deleteById(id);
    }
}