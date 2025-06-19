import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  InputLabel,
  Select,
  Chip,
  IconButton,
  Card,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { PhotoCamera, Delete, Edit } from '@mui/icons-material';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import { useForm, Controller } from 'react-hook-form';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyService,
} from '../services/PropertyService';

import Property from '../components/Property';
import { useToast } from '../contexts/ToastContext';

const PropertyForm = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]); // Estado separado para fotos
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      title: '',
      description: '',
      price: '',
      salePrice: '',
      type: '',
      address: '',
      city: '',
      state: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      furnished: false,
      parkingSpaces: '',
    },
  });

  const handleShowProperties = async () => {
    try {
      const data = await PropertyService.getAllByUser();
      setProperties(data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    }
  };

  useEffect(() => {
    handleShowProperties();
  }, []);

  const onSubmit = async (data: any) => {
    console.log('Dados do formulário:', data); // Log para verificar os dados

    if (photos?.length < 5) {
      showToast('Adicione pelo menos 5 fotos do imóvel.', {
        severity: 'error',
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append(
      'price',
      data.price ? parseFloat(data.price).toString() : ''
    ); // Converte para número e depois para string
    formData.append(
      'salePrice',
      data.salePrice ? parseFloat(data.salePrice).toString() : ''
    ); // Converte para número e depois para string
    formData.append('type', data.type);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('area', parseInt(data.area).toString()); // Converte para número e depois para string
    formData.append('bedrooms', parseInt(data.bedrooms).toString()); // Converte para número
    formData.append('bathrooms', parseInt(data.bathrooms).toString()); // Converte para número
    formData.append('furnished', data.furnished.toString()); // Já é booleano, converte para string
    formData.append('parkingSpaces', parseInt(data.parkingSpaces).toString()); // Converte para número
    formData.append('latitude', '-21.7998438');
    formData.append('longitude', '-46.599383');

    photos.forEach((photo) => {
      formData.append('files', photo);
    });

    try {
      if (isEditing && data.id) {
        const updateData: UpdatePropertyDto = {
          title: data.title,
          description: data.description,
          price: data.price ? parseFloat(data.price) : undefined,
          salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
          type: data.type,
          address: data.address,
          city: data.city,
          state: data.state,
          area: parseInt(data.area),
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseInt(data.bathrooms),
          furnished: data.furnished,
          parkingSpaces: parseInt(data.parkingSpaces),
        };
        console.log('Atualizando imóvel com ID:', data.id); // Log
        await PropertyService.update(data.id, updateData);
      } else {
        await PropertyService.create(formData);
      }
      await handleShowProperties();
      reset({
        id: null,
        title: '',
        description: '',
        price: '',
        salePrice: '',
        type: '',
        address: '',
        city: '',
        state: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        furnished: false,
        parkingSpaces: '',
      });
      setPhotos([]); // Limpa as fotos após submissão
      setOpenModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error); // Log de erro
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limita a 5 fotos e filtra apenas imagens
    const validFiles = files
      .slice(0, 5)
      .filter((file) => file && file.type.startsWith('image/'));

    if (validFiles.length > 0) {
      setPhotos((prevPhotos) => [...prevPhotos, ...validFiles]);
    }

    // Opcional: Limpa o input para evitar seleção duplicada
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteProperty = async (id: any) => {
    try {
      await PropertyService.delete(id); // Assumindo que existe um método delete
      await handleShowProperties();
    } catch (error) {
      console.error('Erro ao deletar imóvel:', error);
    }
  };

  const handleEditProperty = async (id: any) => {
    try {
      const property = await PropertyService.getOne(id);
      setValue('id', property.id);
      setValue('title', property.title);
      setValue('description', property.description || '');
      setValue('price', property.price ? property.price.toString() : '');
      setValue(
        'salePrice',
        property.salePrice ? property.salePrice.toString() : ''
      );
      setValue('type', property.type);
      setValue('address', property.address);
      setValue('city', property.city);
      setValue('state', property.state);
      setValue('area', property.area.toString());
      setValue('bedrooms', property.bedrooms.toString());
      setValue('bathrooms', property.bathrooms.toString());
      setValue('furnished', property.furnished);
      setValue('parkingSpaces', property.parkingSpaces?.toString() || '');
      setPhotos([]); // Limpa fotos ao editar
      setIsEditing(true);
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao carregar imóvel para edição:', error);
    }
  };

  return (
    <>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1">
              Meus Imóveis
            </Typography>
            {properties?.length <= 5 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenModal(true)}
              >
                Adicionar
              </Button>
            )}
          </Box>

          <Dialog
            open={openModal}
            onClose={() => {
              setOpenModal(false);
              setIsEditing(false);
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {isEditing ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <InputLabel htmlFor="title">Título</InputLabel>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="title"
                          fullWidth
                          required
                          hiddenLabel
                          variant="outlined"
                          error={!!errors.title}
                          helperText={errors.title ? 'Campo obrigatório' : ''}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <InputLabel htmlFor="description">Descrição</InputLabel>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="description"
                          fullWidth
                          required
                          hiddenLabel
                          rows={4}
                          variant="outlined"
                          error={!!errors.description}
                          helperText={
                            errors.description ? 'Campo obrigatório' : ''
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={3}>
                    <InputLabel htmlFor="price">Preço Aluguel (R$)</InputLabel>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="price"
                          fullWidth
                          hiddenLabel
                          type="number"
                          variant="outlined"
                          error={!!errors.price}
                          helperText={errors.price ? 'Campo obrigatório' : ''}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={3}>
                    <InputLabel htmlFor="salePrice">
                      Preço Venda (R$)
                    </InputLabel>
                    <Controller
                      name="salePrice"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="salePrice"
                          fullWidth
                          hiddenLabel
                          type="number"
                          variant="outlined"
                          error={!!errors.salePrice}
                          helperText={
                            errors.salePrice ? 'Campo obrigatório' : ''
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
                    <InputLabel htmlFor="tipoImovel">Tipo de Imóvel</InputLabel>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="tipoImovel"
                          hiddenLabel
                          fullWidth
                          required
                          error={!!errors.type}
                        >
                          <MenuItem value="APARTMENT">Apartamento</MenuItem>
                          <MenuItem value="HOUSE">Casa</MenuItem>
                          <MenuItem value="COMMERCIAL">Comercial</MenuItem>
                        </Select>
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <InputLabel htmlFor="address">Endereço</InputLabel>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="address"
                          fullWidth
                          required
                          hiddenLabel
                          variant="outlined"
                          error={!!errors.address}
                          helperText={errors.address ? 'Campo obrigatório' : ''}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
                    <InputLabel htmlFor="city">Cidade</InputLabel>
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="city"
                          fullWidth
                          required
                          hiddenLabel
                          variant="outlined"
                          error={!!errors.city}
                          helperText={errors.city ? 'Campo obrigatório' : ''}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
                    <InputLabel htmlFor="state">Estado</InputLabel>
                    <Controller
                      name="state"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="state"
                          fullWidth
                          required
                          hiddenLabel
                          variant="outlined"
                          error={!!errors.state}
                          helperText={errors.state ? 'Campo obrigatório' : ''}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={2}>
                    <InputLabel htmlFor="area">Área (m²)</InputLabel>
                    <Controller
                      name="area"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="area"
                          fullWidth
                          required
                          hiddenLabel
                          type="number"
                          variant="outlined"
                          error={!!errors.area}
                          helperText={errors.area ? 'Campo obrigatório' : ''}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={3}>
                    <InputLabel htmlFor="bedrooms">Quartos</InputLabel>
                    <Controller
                      name="bedrooms"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="bedrooms"
                          fullWidth
                          required
                          hiddenLabel
                          type="number"
                          variant="outlined"
                          error={!!errors.bedrooms}
                          helperText={
                            errors.bedrooms ? 'Campo obrigatório' : ''
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={3}>
                    <InputLabel htmlFor="bathrooms">Banheiros</InputLabel>
                    <Controller
                      name="bathrooms"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="bathrooms"
                          fullWidth
                          required
                          hiddenLabel
                          type="number"
                          variant="outlined"
                          error={!!errors.bathrooms}
                          helperText={
                            errors.bathrooms ? 'Campo obrigatório' : ''
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={2}>
                    <InputLabel htmlFor="parkingSpaces">Vagas</InputLabel>
                    <Controller
                      name="parkingSpaces"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="parkingSpaces"
                          fullWidth
                          required
                          hiddenLabel
                          type="number"
                          variant="outlined"
                          error={!!errors.parkingSpaces}
                          helperText={
                            errors.parkingSpaces ? 'Campo obrigatório' : ''
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={2}>
                    <Controller
                      name="furnished"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label="Mobiliado"
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                    <Box
                      sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}
                    >
                      {photos.map((photo: any, index) => (
                        <Chip
                          key={index}
                          label={photo.name}
                          onDelete={() => handleRemovePhoto(index)}
                          sx={{ maxWidth: 200 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenModal(false);
                  setIsEditing(false);
                  reset({
                    id: null,
                    title: '',
                    description: '',
                    price: '',
                    salePrice: '',
                    type: '',
                    address: '',
                    city: '',
                    state: '',
                    area: '',
                    bedrooms: '',
                    bathrooms: '',
                    furnished: false,
                    parkingSpaces: '',
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit" // Mantém type="submit" para disparar o onSubmit do form
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit, () => console.log('a'))}
              >
                {isEditing ? 'Salvar' : 'Cadastrar'}
              </Button>
            </DialogActions>
          </Dialog>

          {properties.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Você ainda não cadastrou nenhum imóvel.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {properties.map((property: any) => (
                <Grid size={12} key={property.id}>
                  <Card>
                    <Property property={property}></Property>
                    <CardActions sx={{ justifyContent: 'end' }}>
                      <Box>
                        <IconButton
                          style={{ marginRight: 8 }}
                          color="primary"
                          onClick={() => handleEditProperty(property.id)}
                          aria-label="Editar imóvel"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          style={{ marginLeft: 8 }}
                          onClick={() => handleDeleteProperty(property.id)}
                          aria-label="Remover imóvel"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Container>

      <Footer />
    </>
  );
};

export default PropertyForm;
