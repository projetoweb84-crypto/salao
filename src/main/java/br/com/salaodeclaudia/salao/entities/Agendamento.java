package br.com.salaodeclaudia.salao.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;

    // Removeu o cascade para aceitar livremente IDs de clientes que já existem ou novos gerenciados pelo Controller
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "servico_id")
    private Servico servico;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Agendamento() {
    }

    public Agendamento(Long id, LocalDateTime dataHora, Cliente cliente, Servico servico, Usuario usuario) {
        this.id = id;
        this.dataHora = dataHora;
        this.cliente = cliente;
        this.servico = servico;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Servico getServico() { return servico; }
    public void setServico(Servico servico) { this.servico = servico; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}