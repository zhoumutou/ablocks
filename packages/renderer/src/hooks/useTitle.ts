export function useTitle() {
  const title = ref(document.title)

  onMounted(() => {
    const observer = new MutationObserver(() => {
      title.value = document.title
    })
    observer.observe(document.querySelector('title')!, { childList: true })

    onBeforeUnmount(() => {
      observer.disconnect()
    })
  })

  return title
}
