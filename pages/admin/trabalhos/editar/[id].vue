<template>
    <UForm :state="form" :validate="validate" @submit="onSubmit">
        <UFormField label="Título" name="titulo">
            <UInput v-model="form.titulo" />
        </UFormField>

        <UFormField label="Data" name="data">
            <UInput v-model="form.data" type="date" />
        </UFormField>

        <UFormField label="Resumo" name="resumo">
            <UTextarea v-model="form.resumo" />
        </UFormField>

        <UFormField label="Link para o Arquivo" name="arquivo">
            <UInput v-model="form.arquivo" placeholder="https://..." />
        </UFormField>

        <UFormField label="Status" name="status">
            <USelect v-model="form.status" :items="['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']" />
        </UFormField>

        <UFormField label="Autor 1" name="autor1">
            <UInput v-model="form.autor1" />
        </UFormField>

        <UFormField label="Autor 2 (Opcional)" name="autor2">
            <UInput v-model="form.autor2" />
        </UFormField>

        <UFormField label="Autor 3 (Opcional)" name="autor3">
            <UInput v-model="form.autor3" />
        </UFormField>

        <UFormField label="Autor 4 (Opcional)" name="autor4">
            <UInput v-model="form.autor4" />
        </UFormField>

        <UFormField label="Orientador" name="orientador">
            <UInput v-model="form.orientador" />
        </UFormField>

        <UFormField label="Coorientador (Opcional)" name="coorientador">
            <UInput v-model="form.coorientador" />
        </UFormField>

        <UFormField label="Referências Bibliográficas" name="refbibliografica">
            <UTextarea v-model="form.refbibliografica" />
        </UFormField>

        <UFormField label="Tipo do trabalho" name="tipoTrabalhoId">
            <USelect v-model="form.tipoTrabalhoId" :items="tiposTrabalho" placeholder="Selecione o tipo" />
        </UFormField>

        <UFormField label="Curso" name="cursoId">
            <USelect v-model="form.cursoId" :items="cursos" placeholder="Selecione o curso" />
        </UFormField>

        <UButton type="submit" :loading="loading" class="mt-4">Cadastrar</UButton>
    </UForm>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { object, string, number, date, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const loading = ref(false)

const trabalhoId = computed(() => route.params.id as string)

const { data: trabalhoData, error: trabalhoError } = await useFetch(`/api/trabalhos/${trabalhoId.value}`, { key: `trabalho-${trabalhoId.value}` })
const { data: cursos, error: cursosError } = await useFetch('/api/cursos', {
    key: 'cursos-list',
    transform: (data: any[]) => Array.isArray(data) ? data.map(c => ({ label: c.curso, value: c.id })) : [],
    default: () => []
})
const { data: tiposTrabalho, error: tiposError } = await useFetch('/api/tipos-trabalho', {
    key: 'tipos-trabalho-list',
    transform: (data: any[]) => Array.isArray(data) ? data.map(t => ({ label: t.descricao, value: t.id })) : [],
    default: () => []
})

if (trabalhoError.value) {
    toast.add({ title: 'Erro', description: 'Não foi possível carregar os dados do trabalho.', color: 'error' })
}

const form = ref({
    titulo: '',
    data: '',
    resumo: '',
    status: 'PENDENTE',
    arquivo: '',
    autor1: '',
    autor2: '',
    autor3: '',
    autor4: '',
    orientador: '',
    coorientador: '',
    refbibliografica: '',
    tipoTrabalhoId: undefined as number | undefined,
    cursoId: undefined as number | undefined
})

watchEffect(() => {
    if (trabalhoData.value) {
        const trabalho = trabalhoData.value as any;
        form.value = {
            ...trabalho,
            data: new Date(trabalho.data).toISOString().split('T')[0]
        }
    }
})

const schema = object({
    titulo: string().required('Título é obrigatório'),
    data: date().required('Data é obrigatória'),
    resumo: string().required('Resumo é obrigatório'),
    status: string().oneOf(['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']).required('Status é obrigatório'),
    arquivo: string().url('Deve ser uma URL válida').required('O link para o arquivo é obrigatório'),
    autor1: string().required('Pelo menos um autor é obrigatório'),
    orientador: string().required('Orientador é obrigatório'),
    refbibliografica: string().required('Referências são obrigatórias'),
    tipoTrabalhoId: number().typeError('Selecione um tipo').required('Tipo do trabalho é obrigatório'),
    cursoId: number().typeError('Selecione um curso').required('Curso é obrigatório')
})

type Schema = InferType<typeof schema>

async function validate(state: any): Promise<any[]> {
    try {
        await schema.validate(state, { abortEarly: false })
        return []
    } catch (err: any) {
        return err.inner
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        await $fetch(`/api/trabalhos/${trabalhoId.value}`, {
            method: 'PUT',
            body: event.data
        })

        toast.add({ title: 'Trabalho atualizado com sucesso!', color: 'success' })
        await router.push('/admin/trabalhos')

    } catch (err: any) {
        toast.add({ title: 'Erro ao atualizar', description: err.data?.statusMessage || 'Tente novamente.', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>