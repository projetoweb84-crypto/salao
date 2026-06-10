package br.com.salaodeclaudia.salao.controllers;

import br.com.salaodeclaudia.salao.entities.Cliente;
import br.com.salaodeclaudia.salao.services.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ClienteController {
    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> listarTodos() { return clienteService.listarTodos(); }

    @PostMapping
    public Cliente salvar(@RequestBody Cliente cliente) { return clienteService.salvar(cliente); }
}