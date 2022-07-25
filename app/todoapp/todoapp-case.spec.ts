import {Page, ScreenshotOptions} from "puppeteer";
import {sleep} from "../../utils";
import * as path from "path";

const pathSuffix = path.resolve(__dirname, './screenshot')

describe('TodoApp Case', function () {
  let todoName = 'This is todoapp testing from e2e-case of puppeteer !!!'
  let page: Page
  let fetchData = {
    todoList: [] as Array<any>,
    addTodo: {} as any
  }

  async function screenshot (o: ScreenshotOptions) {
    o.path = path.resolve(pathSuffix, String(o.path))
    await page.screenshot(o)
  }

  const getCaseMark = (mark: string, selector: string = '') => {
    return `[data-casemark=${mark}] ${selector}`.trim()
  }

  beforeAll(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage()
    await page.goto('http://localhost:8080/')
    page.on('response', async (res) => {
      let url = res.url()
      let method = res.request().method().toLowerCase()
      if (method === 'get' && url.includes('/api/todo')) {
        let resBody = await res.json()
        fetchData.todoList = resBody.data
      }
      if (method === 'post' && url.includes('/api/todo')) {
        let resBody = await res.json()
        console.log(resBody)
        fetchData.addTodo = resBody.data
      }
    })

  })

  it('TodoApp Inspection', async () => {
    await screenshot({path: 'open todoApp.png'})
    let title = await page.title()
    expect(title).toBe('vue3-todoapp')
  })

  it('TodoApp should match to fetchData todolist data', async () => {
    let todos = await page.$$eval(getCaseMark('todolist', 'li'), (elems) => {
      return elems.map(el => {
        return {
          name: (el.querySelector('input') as HTMLInputElement).value,
          done: Array.from(el.classList).includes('todo-done'),
          id: el.getAttribute('data-casemark-id')
        }
      })
    })
    for (const item of fetchData.todoList) {
      let isMatch = todos.find(todo => {
        return String(todo.id) === String(item.id)
          && todo.name === item.name
          && Boolean(todo.done) === Boolean(item.done)
      })
      expect(isMatch).toBeDefined()
    }
    await screenshot({path: 'show todolist.png'})
  })

  it('TodoApp should can add todolist', async () => {
    let todoListLength = await page.$eval(getCaseMark('todolist'), elem => elem.children.length)
    let preAddedInput = await page.$(getCaseMark('pre-add-input'))

    await preAddedInput?.focus()
    await page.keyboard.sendCharacter(todoName)
    let submitElement = await page.$(getCaseMark('submit'))

    await submitElement?.click()
    await sleep(1000)

    let newTodoListLength = await page.$eval(getCaseMark('todolist'), elem => elem.children.length)
    expect(newTodoListLength).toBe(todoListLength + 1)

    let todoListNames = await page.$$eval(getCaseMark('todolist', 'li input'), elems => {
      return elems.map((el) => (el as HTMLInputElement).value)
    })

    expect(todoListNames).toContain(todoName)

    await screenshot({path: 'add todo item.png'})
  })

  it('TodoApp should can update todoName', async () => {
    let updateTodoName = `This is update of todoName`
    let selector = getCaseMark('todolist', `[data-casemark-id="${fetchData.addTodo.id}"] input`)
    let input = await page.$(selector)
    await input?.focus()
    await input?.click({clickCount: todoName.length})
    await input?.press('Backspace')

    await page.keyboard.sendCharacter(updateTodoName)

    let body = await page.$('body')
    await body?.click()   // 失去焦点

    await sleep(1000)

    let newSelector = getCaseMark('todolist', `[data-casemark-id="${fetchData.addTodo.id}"] input`)
    let inputValue = await page.$eval(newSelector, el => (el as HTMLInputElement).value)

    await screenshot({path: 'update todo item of name.png'})

    expect(inputValue).toBe(updateTodoName)
  })

  it('TodoApp should can done the todo', async () => {
    let doneSelector = getCaseMark('todolist', `[data-casemark-id="${fetchData.addTodo.id}"] .done`)
    let doneHandle = await page.$(doneSelector)
    await doneHandle?.click()
    await sleep(1000)

    await screenshot({path: 'done todo item.png'})

    let todoSelector = getCaseMark('todolist', `[data-casemark-id="${fetchData.addTodo.id}"]`)
    let isDone = await page.$eval(todoSelector, el => Array.from(el.classList).includes('todo-done'))

    expect(isDone).toBe(true)
  })

  it('TodoApp should can delete todolist', async () => {
    let todoListLength = await page.$eval(getCaseMark('todolist'), elem => elem.children.length)

    let selector = getCaseMark('todolist', `[data-casemark-id="${fetchData.addTodo.id}"] .delete`)
    let addTodoDeleteHandle = await page.$(selector)
    await addTodoDeleteHandle?.click()
    await sleep(1000)

    await screenshot({path: 'delete todo item.png'})

    let newTodoListLength = await page.$eval(getCaseMark('todolist'), elem => elem.children.length)
    expect(newTodoListLength).toBe(todoListLength - 1)
  })

});
