package br.com.salaodeclaudia.salao.controllers;

import br.com.salaodeclaudia.salao.entities.Agendamento;
import br.com.salaodeclaudia.salao.entities.Cliente;
import br.com.salaodeclaudia.salao.entities.Servico;
import br.com.salaodeclaudia.salao.repositories.AgendamentoRepository;
import br.com.salaodeclaudia.salao.repositories.ClienteRepository;
import br.com.salaodeclaudia.salao.repositories.ServicoRepository;
import br.com.salaodeclaudia.salao.services.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @GetMapping
    public List<Agendamento> listarTodos() {
        return agendamentoService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Agendamento agendamento) {
        // 1. Evita horários duplicados
        if (agendamento.getDataHora() != null && agendamentoRepository.existsByDataHora(agendamento.getDataHora())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Horário já preenchido!");
        }

        // 2. BUSCA O CLIENTE REAL NO BANCO (Resolve o erro do Detached Entity!)
        if (agendamento.getCliente() != null && agendamento.getCliente().getId() != null) {
            Cliente clienteReal = clienteRepository.findById(agendamento.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            agendamento.setCliente(clienteReal);
        } else {
            return ResponseEntity.badRequest().body("É necessário selecionar um cliente válido.");
        }

        // 3. BUSCA O SERVIÇO REAL NO BANCO
        if (agendamento.getServico() != null && agendamento.getServico().getId() != null) {
            Servico servicoReal = servicoRepository.findById(agendamento.getServico().getId())
                    .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
            agendamento.setServico(servicoReal);
        } else {
            return ResponseEntity.badRequest().body("É necessário selecionar um serviço válido.");
        }

        // Remove usuário para não quebrar se não estiver logado
        agendamento.setUsuario(null);

        Agendamento salvo = agendamentoService.salvar(agendamento);
        return ResponseEntity.ok(salvo);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
    }
}