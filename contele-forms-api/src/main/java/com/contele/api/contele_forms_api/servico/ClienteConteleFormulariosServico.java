package com.contele.api.contele_forms_api.servico;

import com.contele.api.contele_forms_api.modelo.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ClienteConteleFormulariosServico {

    private final WebClient formsWebClient;
    private final WebClient tasksWebClient;
    private final WebClient usersWebClient;

    public ClienteConteleFormulariosServico(
            @Qualifier("formsWebClient") WebClient formsWebClient,
            @Qualifier("tasksWebClient") WebClient tasksWebClient,
            @Qualifier("usersWebClient") WebClient usersWebClient) {
        this.formsWebClient = formsWebClient;
        this.tasksWebClient = tasksWebClient;
        this.usersWebClient = usersWebClient;
    }

    public Mono<RespostaTemplatesFormulariosContele> obterTemplatesFormularios() {
        return formsWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/list-forms-templates")
                        .queryParam("status", "active")
                        .queryParam("page", 1)
                        .queryParam("per_page", 50)
                        .queryParam("add_users_information_to_form_template", true)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> clientResponse.createException())
                .bodyToMono(RespostaTemplatesFormulariosContele.class);
    }

    public Mono<RespostaFormulariosContele> obterFormulariosPorVisita(String idDaVisita) {
        // Formata o ID da visita para o formato de URN exigido pela API
        String linkedUrn = "v0:cge:task:" + idDaVisita;

        return formsWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/list-forms")
                        .queryParam("add_templates_information_to_form", true)
                        .queryParam("add_pois_information_to_form", true)
                        .queryParam("add_tasks_information_to_form", true)
                        .queryParam("add_users_information_to_form", true)
                        .queryParam("only_forms_with_answers", true)
                        .queryParam("linked_urns", linkedUrn)
                        .queryParam("page", 1)
                        .queryParam("per_page", 100)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> clientResponse.createException())
                .bodyToMono(RespostaFormulariosContele.class);
    }
    public Mono<RespostaTarefasContele> obterTodasAsVisitas() {
        return tasksWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/tasks")
                        .queryParam("include",true)
                        .queryParam("page", 1)
                        .queryParam("perPage", 100)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> clientResponse.createException())
                .bodyToMono(RespostaTarefasContele.class);
    }

    public Mono<Tarefa> obterVisitaPorId(String taskId) {
        return tasksWebClient.get()
                .uri("/v2/tasks/{taskId}", taskId)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> clientResponse.createException())
                .bodyToMono(Tarefa.class);
    }


    /*public Mono<Usuario> obterUsuarioPorId(String userId) {
        return usersWebClient.get()
                .uri("/api/v1/users/{userId}", userId)
                .retrieve()
                .bodyToMono(Usuario.class);
    }*/

  
}
