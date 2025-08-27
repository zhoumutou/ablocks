export function useTitle() {
  const title = ref(document.title)

  onMounted(() => {
    const observer = new MutationObserver(() => {
      title.value = document.title
    })

    let titleEl = document.querySelector('title')
    if (!titleEl) {
      document.title = ''
      titleEl = document.querySelector('title')
    }

    observer.observe(titleEl!, { childList: true })

    onBeforeUnmount(() => {
      observer.disconnect()
    })
  })

  return title
}
