import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Divider,
  TextField,
  Button,
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

interface RespostaFormulariosContele {
  forms: Form[];
}

interface Tarefa {
  id: string;
  observation: string;
  status: string;
  creatorName: string;
  poi: {
    name: string;
    address: {
      street: string;
      number: string;
      city: string;
    };
  };
  userData: {
    name: string;
  };
}

const ConsultarChecklist: React.FC = () => {
  const [numeroTotvs, setNumeroTotvs] = useState('');
  const [visita, setVisita] = useState<Tarefa | null>(null);
  const [formularios, setFormularios] = useState<Form[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!numeroTotvs.trim()) {
      setError('Por favor, digite um número do Ckecklist da Totvs.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVisita(null);
    setFormularios(null);

    try {
      // 1. Busca a visita pelo número da Totvs
      const visitaResponse = await axios.get<Tarefa>(`${API_BASE_URL}/tarefas/totvs/${numeroTotvs}`);
      const visitaData = visitaResponse.data;
      setVisita(visitaData);

      // 2. Com o ID da visita, busca os formulários associados
      const formulariosResponse = await axios.get<RespostaFormulariosContele>(
        `${API_BASE_URL}/formularios/visita/${visitaData.id}`
      );
      setFormularios(formulariosResponse.data.forms);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Visita não encontrada para este número Totvs.');
      } else {
        setError('Ocorreu um erro ao buscar os dados. Verifique sua conexão ou tente novamente.');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Consultar Checklist
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
          <TextField
            fullWidth
            label="Número do Ckecklist Totvs"
            variant="outlined"
            value={numeroTotvs}
            onChange={(e) => setNumeroTotvs(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={isLoading}
            sx={{ px: 4 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Buscar'}
          </Button>
        </Box>
        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
      
      {visita && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Detalhes da Visita
          </Typography>
          <Typography variant="body1"><strong>Observação:</strong> {visita.observation}</Typography>
          <Typography variant="body1"><strong>ID da Visita:</strong> {visita.id}</Typography>
          <Typography variant="body1"><strong>Status:</strong> {visita.status}</Typography>
          <Typography variant="body1"><strong>Responsável:</strong> {visita.creatorName || visita.userData?.name || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Cliente:</strong> {visita.poi.name}</Typography>
          <Typography variant="body1"><strong>Endereço:</strong> {visita.poi.address.street}, {visita.poi.address.number}, {visita.poi.address.city}</Typography>
        </Paper>
      )}

      {formularios && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Detalhes do Formulário
          </Typography>
          <pre>{JSON.stringify(formularios, null, 2)}</pre>
        </Paper>
      )}
    </Container>
  );
};

export default ConsultarChecklist;
