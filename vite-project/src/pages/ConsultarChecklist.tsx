import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Divider,
} from '@mui/material';

// AQUI: A URL base está correta
const API_BASE_URL = 'http://localhost:8080/api/v1/contele';

interface Answer {
  id: string;
  answer: string;
  form_question_id: string;
}

interface Form {
  answers: Answer[];
}

interface ChecklistData {
  forms: Form[];
}

interface TarefaData {
  tarefa_titulo: string;
  tarefa_id: string;
  concluded_at: string;
  users: {
    user_id: string;
    // Outras propriedades do usuário...
  }[];
}

// AQUI: O tipo de dado do usuário foi ajustado para corresponder ao que a API retorna
interface UserData {
  id: string;
  username: string;
  email: string;
  full_name: string;
}

const ConsultarChecklist: React.FC = () => {
  const [dadosChecklist, setDadosChecklist] = useState<ChecklistData | null>(null);
  const [dadosTarefa, setDadosTarefa] = useState<TarefaData | null>(null);
  const [responsavel, setResponsavel] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      setError('ID não encontrado na URL.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fazendo as chamadas em paralelo para otimizar o tempo de carregamento
        const [checklistResponse, tarefaResponse] = await Promise.all([
          axios.get<ChecklistData>(`${API_BASE_URL}/form_answers/${id}`),
          axios.get<TarefaData>(`${API_BASE_URL}/tasks/${id}`), 
        ]);

        const checklistData = checklistResponse.data;
        const tarefaData = tarefaResponse.data;
        
        setDadosChecklist(checklistData);
        setDadosTarefa(tarefaData);
        
        if (tarefaData.users && tarefaData.users.length > 0) {
          const userId = tarefaData.users[0].user_id;
          // AQUI: CORREÇÃO! A URL deve incluir o caminho /api/v1
          const userResponse = await axios.get<UserData>(`${API_BASE_URL}/users/${userId}`);
          setResponsavel(userResponse.data);
        } else {
          setResponsavel(null);
        }

      } catch (err) {
        setError('Erro ao carregar os dados. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!dadosChecklist) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6">Nenhum dado encontrado para este checklist.</Typography>
      </Container>
    );
  }

  // Tratamento da data
  const dataConclusao = dadosTarefa?.concluded_at ? new Date(dadosTarefa.concluded_at).toLocaleDateString() : 'N/A';

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Consultar Checklist
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {dadosTarefa?.tarefa_titulo || 'Desconhecido'}
        </Typography>
        <Typography variant="body1">
          <strong>ID da Visita:</strong> {id}
        </Typography>
        <Typography variant="body1">
          <strong>Responsável:</strong> {responsavel?.full_name || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Data de Conclusão:</strong> {dataConclusao}
        </Typography>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        Detalhes do Formulário
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <pre>{JSON.stringify(dadosChecklist.forms, null, 2)}</pre>
      </Paper>
    </Container>
  );
};

export default ConsultarChecklist;
