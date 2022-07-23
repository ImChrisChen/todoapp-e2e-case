import {ElementHandle, Page} from "puppeteer";
import {sleep} from "../../utils";

describe('TodoApp Case', function () {
  let todoName = 'This is todoapp testing from e2e-case of puppeteer !!!'
  let page: Page

  beforeAll(async () => {
    // @ts-ignore
    page = await globalThis.__BROWSER_GLOBAL__.newPage()
    await page.goto('http://localhost:8080/')
  })

  it('TodoApp Inspection', async () => {
    await page.screenshot({path: '打开App截图.png'})
    let title = await page.title()
    expect(title).toBe('vue3-todoapp')
  })

  it('TodoApp should can add todolist', async () => {
    let todoListLength = await page.$eval('[data-casemark=todolist]', elem => elem.children.length)
    let preAddedInput = await page.$('[data-casemark=pre-add-input]')


    await preAddedInput?.focus()
    await page.keyboard.sendCharacter(todoName)
    let submitElement = await page.$('[data-casemark=submit]')

    await submitElement?.click()
    await sleep(1000)

    let newTodoListLength = await page.$eval('[data-casemark=todolist]', elem => elem.children.length)
    expect(newTodoListLength).toBe(todoListLength + 1)

    let todoListNames = await page.$$eval('[data-casemark=todolist] li input', elems => elems.map((el) => (el as HTMLInputElement).value))

    expect(todoListNames).toContain(todoName)

    await page.screenshot({path: '新增todo.png'})
  })

  it('TodoApp should can delete todolist', async () => {
    // let todoHandle = await page.evaluateHandle(() => {
    //   let lists = document.querySelectorAll('[data-casemark=todolist] li')
    //   for (const li of lists) {
    //     let input = li.querySelector('input')
    //     if (input?.value && todoName.includes(input.value)) {
    //       return li
    //     }
    //   }
    // })
    // let deleteHandle = await page.evaluateHandle((li) => li?.querySelector('.delete'), todoHandle)
    // let doneHandle = await page.evaluateHandle((li) => li?.querySelector('.done'), todoHandle)

    let todoListLength = await page.$eval('[data-casemark=todolist]', elem => elem.children.length)
    let lastTodoHandle = await page.$('[data-casemark=todolist] li:last-child .delete')
    await lastTodoHandle?.click()
    await sleep(1000)

    let newTodoListLength = await page.$eval('[data-casemark=todolist]', elem => elem.children.length)
    expect(newTodoListLength).toBe(todoListLength + 1)
  })
});
