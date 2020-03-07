class Demo {
  print() {
    console.log("this, ", this)
  }
  hello() {
    console.log("hello")
    this.print()
  }
}

const demo = new Demo()
demo.hello()