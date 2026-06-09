package br.com.salaodeclaudia.salao.controllers;

import br.com.salaodeclaudia.salao.entities.Agendamento;
import br.com.salaodeclaudia.salao.services.AgendamentoService;
import br.com.salaodeclaudia.salao.repositories.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @GetMapping
    public List<Agendamento> listarTodos() {
        return agendamentoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Agendamento buscarPorId(@PathVariable Long id) {
        return agendamentoService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Agendamento agendamento) {
        if (agendamentoRepository.existsByDataHora(agendamento.getDataHora())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Horário já preenchido!");
        }
        Agendamento salvo = agendamentoService.salvar(agendamento);
        return ResponseEntity.ok(salvo);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
    }
}