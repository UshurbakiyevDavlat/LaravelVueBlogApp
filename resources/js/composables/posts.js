import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default function usePosts() {
    const posts = ref({})
    const router = useRouter()
    const validationErrors = ref({})
    const isLoading = ref(false)

    const getPosts = async (
        $page = 1,
        category = '',
        column = 'created_at',
        order = 'desc',
    ) => {
        axios.get(
                '/api/posts?page=' + $page
                + '&category=' + category
                + '&column=' + column
                + '&order=' + order,
            )
            .then(response => {
                posts.value = response.data
            })
            .catch(error => {
                console.log(error)
            })
    }

    const storePost = async (post) => {
        if (isLoading.value) return;

        let serializedPost = new FormData()
        for(let item in post) {
            if (post.hasOwnProperty(item)) {
                serializedPost.append(item, post[item])
            }
        }

        isLoading.value = true
        validationErrors.value = {}

        axios.post('/api/posts', serializedPost)
            .then(response => {
                router.push({ name: 'post.index' })
            })
            .catch(error => {
                console.log(error)
                validationErrors.value = error.response.data.errors
            }).finally(() => (isLoading.value = false))
    }

    return { posts, getPosts, storePost, validationErrors, isLoading };
}
