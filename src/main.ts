import { createVuestic, createVuesticEssential, VaButton } from 'vuestic-ui'
import 'vuestic-ui/styles/essential.css'
import 'vuestic-ui/styles/grid.css'
import 'vuestic-ui/styles/reset.css'
import 'vuestic-ui/styles/typography.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.use(createVuesticEssential({ components: { VaButton } }));
app.use(
    createVuestic({
        config: {
            colors: {
                variables: {
                    // Default colors
                    primary: "#1453d3",
                    secondary: "#002c85",
                    success: "#40e583",
                    info: "#2c82e0",
                    danger: "#e34b4a",
                    warning: "#ffc200",
                    gray: "#babfc2",
                    dark: "#34495e",

                    // Custom colors
                    yourCustomColor: "#d0f55d",
                },
            },
        },
    })
)
app.mount('#app')
