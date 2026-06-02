package br.com.salaodeclaudia.salao.controllers;

import br.com.salaodeclaudia.salao.entities.Servico;
import br.com.salaodeclaudia.salao.services.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping
    public List<Servico> listarTodos() {
        return servicoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Servico buscarPorId(@PathVariable Long id) {
        return servicoService.buscarPorId(id);
    }

    @PostMapping
    public Servico salvar(@RequestBody Servico servico) {
        return servicoService.salvar(servico);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        servicoService.deletar(id);
    }
}