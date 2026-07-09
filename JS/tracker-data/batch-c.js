if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch C — OOP & Prototypes",
    topics: [
      {
        id: "proto-chain",
        title: "Prototype Chain",
        status: "done",
        analogy: "Think of it like inheriting traits from your family tree. You might not personally 'have' your grandmother's eye color coded into your own DNA copy — but if someone asks 'what's your eye color?' and you don't have an answer yourself, JS (like a genealogist) walks up your family tree until it finds an ancestor who does. That's the prototype chain — objects don't duplicate properties, they look them up through a chain of linked ancestors.",
        core: "Every object in JS has an internal, hidden link to another object called its prototype. When you access a property, JS first checks the object itself — if not found, it walks up the prototype chain, checking each linked object in turn, until it finds the property or reaches null (the end of the chain). This solves sharing behavior without duplicating it (saving memory and avoiding painful updates).",
        code: `const animal = {
  eats: true,
  walk() { console.log("Animal walks"); }
};

const rabbit = {
  jumps: true,
  __proto__: animal // rabbit's prototype is animal
};

console.log(rabbit.eats);  // true — found via prototype chain
rabbit.walk();             // "Animal walks" — method found on animal
console.log(rabbit.jumps); // true — found directly on rabbit`,
        mistake: "Confusing Object.prototype methods being shared vs copied. For example, a.toString === b.toString is true (same exact function reference shared via the chain, not two separate copies living on a and b).",
        interview: "Object.create(animal) sets animal as the new object's prototype — it's a live link, not a copy. So if you add or change a property on animal after creation, the new object sees that change immediately, because property lookups walk the prototype chain at access time. Object.assign({}, animal) copies animal's own properties as a one-time snapshot onto a new plain object — the two objects are completely disconnected afterward, so later changes to animal have zero effect on the copy.",
        diagram: `rabbit.walk() lookup:
┌─────────────────┐
│ rabbit          │  jumps: true (no 'walk' here)
├─────────────────┤
│ animal (proto)  │  eats: true, walk: fn() (FOUND -> stop here)
├─────────────────┤
│ Object.prototype│  (toString, hasOwnProperty, etc.)
├─────────────────┤
│ null            │  ← end of chain
└─────────────────┘`,
        traps: [
          "Lookup walks own object → prototype → prototype's prototype → ... → <code>null</code>, stopping at the <b>first match</b>. Every object eventually chains up to <code>Object.prototype</code> — which is why <code>.toString()</code>/<code>.hasOwnProperty()</code> work on any object.",
          "Shared methods are NOT copied per instance — <code>a.toString === b.toString</code> is <code>true</code>, same exact function reference via the chain, not two separate copies.",
          "<b>this inside a prototype method always resolves from the CALL SITE, not where the method is stored.</b> If <code>rabbit.walk()</code> calls a <code>walk</code> found on <code>animal</code> (rabbit's prototype), <code>this</code> is still <code>rabbit</code> — implicit binding (Rule 3) applies based on what's left of the dot, regardless of where the method physically lives in the chain.",
          "<code>hasOwnProperty</code> distinguishes own vs inherited: <code>rabbit.hasOwnProperty('eats')</code> is <code>false</code> even though <code>rabbit.eats</code> works — eats is inherited, not owned."
        ],
        interviewQ: "If rabbit.walk is called and walk is found on animal (rabbit's prototype), what does this refer to inside walk() — rabbit or animal? Why?"
      },
      {
        id: "proto-vs-prototype",
        title: "__proto__ vs .prototype",
        status: "done",
        analogy: "Think of .prototype as the architect's blueprint for a house, and __proto__ as the actual physical foundation of the house built from that blueprint. The blueprint itself is just a document (property on the constructor), while the foundation is a physical link on the house (instance).",
        core: ".prototype is a property automatically created on function declarations. It acts as the blueprint for objects created when invoking the function with 'new'. __proto__ is a getter/setter property on Object.prototype that exposes the internal [[Prototype]] link of an instance, pointing to its inheritance parent.",
        code: `function Animal() {}
const dog = new Animal();

console.log(dog.prototype); // undefined (plain objects don't have .prototype)
console.log(dog.__proto__ === Animal.prototype); // true (points to blueprint)
console.log(Animal.__proto__ === Function.prototype); // true (constructor is a function)`,
        mistake: "Checking dog.prototype or assuming instances have a .prototype property. Only functions have a .prototype property (to build instances from). Instances use __proto__ (or Object.getPrototypeOf) to read their prototype chain.",
        interview: "prototype is a property on constructor functions used as a blueprint to set up the prototype chain of new instances. __proto__ is the actual accessor property on instances that points to their inherited prototype object.",
        diagram: `Animal (Constructor Function) ──.prototype──▶ Animal.prototype
              │                                     ▲
         new Animal()                               │
              │                                     │
              ▼                                     │
         dog (instance) ────────__proto__───────────┘`,
        traps: [
          "<code>.prototype</code> exists ONLY on functions usable as constructors — it's the blueprint object. <code>__proto__</code> exists on EVERY object (including functions) — it's the actual link pointing to what that object inherits from.",
          "<code>dog.prototype</code> is <code>undefined</code> — plain instances don't have <code>.prototype</code>. Only <code>Animal.prototype</code> (the constructor function) has it. Mixing this up is one of the most common OOP interview stumbles.",
          "<code>dog.__proto__ === Animal.prototype</code> is a <b>live reference</b>, not a snapshot. If <code>Animal.prototype.walk</code> is reassigned AFTER <code>dog</code> was created, <code>dog.walk()</code> uses the NEW version — because prototype lookup happens at <b>call time</b>, not creation time.",
          "Modern best practice: avoid <code>__proto__</code> directly (legacy accessor) — use <code>Object.getPrototypeOf(obj)</code> / <code>Object.setPrototypeOf(obj, proto)</code> instead."
        ],
        interviewQ: "If Animal.prototype.walk is reassigned AFTER dog was already created with new Animal(), does dog.walk() use the old or new version? Why?"
      },
      {
        id: "object-create",
        title: "Object.create",
        status: "done",
        analogy: "Object.create(animal) is like plugging a new computer into a central server — you fetch data live from the server. Object.assign({}, animal) is like copying files onto a USB drive and taking it away — you have a snapshot that won't receive future server updates.",
        core: "Object.create(proto) creates a new object and sets its [[Prototype]] directly to proto. Object.assign(target, ...sources) copies enumerable own properties from source to target. Object.create(null) is used to create prototype-less dictionaries to avoid prototype pollution bugs.",
        code: `const animal = { eats: true };
const rabbit = Object.create(animal);
const clone = Object.assign({}, animal);

animal.eats = false;
console.log(rabbit.eats); // false (live chain lookup)
console.log(clone.eats);  // true (snapshot copy)`,
        mistake: "Assuming Object.assign links prototypes, or that Object.create(null) has utility methods like toString. Object.create(null) has NO prototype, meaning calls to .hasOwnProperty or .toString will fail with TypeErrors.",
        interview: "Object.create(proto) establishes a prototype linkage, while Object.assign copies properties directly onto the object itself. Use Object.create(null) to bypass Object.prototype when creating clean hash maps.",
        diagram: `Object.create(animal):
┌───────────┐
│ rabbit    │ (empty: {})
└─────┬─────┘
      │ __proto__
      ▼
┌───────────┐
│ animal    │ { eats: true }
└───────────┘

Object.assign({}, animal):
┌───────────┐
│ clone     │ { eats: true } (own property, no __proto__ link)
└───────────┘`,
        traps: [
          "<code>Object.create(proto)</code> sets <code>proto</code> as a <b>live prototype link</b> — no copying happens. <code>Object.assign({}, proto)</code> or spread copies OWN properties as a one-time <b>snapshot</b> — completely disconnected afterward.",
          "Proof: <code>Object.create(a).hasOwnProperty('x')</code> is <code>false</code> (inherited via chain) vs <code>Object.assign({}, a).hasOwnProperty('x')</code> is <code>true</code> (actually copied onto the new object).",
          "<code>Object.create(null)</code> creates a truly bare object with <b>zero</b> inherited properties — not even <code>Object.prototype</code>. <code>pureDict.toString</code> is <code>undefined</code>. Useful for hash maps/dictionaries to avoid collisions with inherited keys like <code>toString</code>, <code>constructor</code>."
        ],
        interviewQ: "What's the key difference between Object.create(animal) and Object.assign({}, animal) — if you later change a property on the original animal, which one reflects that change?"
      },
      {
        id: "class-syntax",
        title: "ES6 class (what it desugars to)",
        status: "done",
        analogy: "Classes are a modern dashboard on a car that still runs on a prototype engine. The interface looks like a traditional class system, but underneath, it is still wiring objects together using prototypes.",
        core: "ES6 class syntax compiles to constructor functions and prototype method bindings. Key engine-level differences include: no hoisting (TDZ applies), automatic strict-mode enforcement, and an internal constructor check flag that throws when called without 'new'.",
        code: `class Animal {
  constructor(name) { this.name = name; }
  walk() { console.log("walk"); }
}
console.log(typeof Animal); // "function"

// Animal("Rex"); // TypeError: Class constructor cannot be invoked without 'new'`,
        mistake: "Calling a class without the new operator, or expecting class variables/methods to be hoisted like standard function declarations.",
        interview: "Classes are syntactic sugar for prototype-based constructor functions, but they enforce safety checks like automatic strict mode, no function hoisting, and checking an internal flag to prevent calling without the new operator.",
        diagram: `class Animal { walk() {} }
compiles conceptually to:
function Animal() {}
Animal.prototype.walk = function() {}`,
        traps: [
          "<code>class</code> is syntactic sugar over the exact same prototype chain — <code>typeof Animal === \"function\"</code>, methods land on <code>.prototype</code> automatically, <code>dog.__proto__ === Animal.prototype</code> is still true.",
          "Classes are hoisted into the <b>Temporal Dead Zone</b> (like let/const), NOT fully hoisted like function declarations — using a class before its definition throws a ReferenceError.",
          "Class bodies run in <b>strict mode automatically</b> — no 'use strict' needed, which is why silent failures (like the frozen-object trap) become loud TypeErrors inside classes.",
          "Classes carry an internal \"must be called with new\" flag that regular functions lack. Calling a class without <code>new</code> throws immediately (TypeError). Calling an old-style constructor function without <code>new</code> silently produces a bug — this bound to global/undefined, no error at all. This proves class isn't PURELY cosmetic — it adds real enforced semantics.",
          "class does NOT give true private fields by default — anything without the <code>#</code> prefix is still publicly accessible, same as any prototype object."
        ],
        interviewQ: "If ES6 classes are 'just syntactic sugar' over prototypes, why does calling a class constructor without new throw a hard error, while an old-style constructor function without new just silently bugs out? What does that tell you about what class actually changes?"
      },
      {
        id: "inheritance",
        title: "Inheritance (extends/super)",
        status: "done",
        analogy: "extends is like a child taking over a family shop. They automatically get all the tools (prototype methods), but they can also add new ones. super() is calling the parent to set up the shop's foundational structure before they can start arranging their own tools (using 'this').",
        core: "extends wires up the prototype chain from derived to base constructor and prototype. super() executes the parent constructor. In derived constructors, 'this' starts uninitialized and is created only when super() executes.",
        code: `class Animal {
  constructor(name) { this.name = name; }
}
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // MUST call first before accessing 'this'
    this.breed = breed;
  }
}`,
        mistake: "Accessing this in the subclass constructor before executing super(), or neglecting to forward constructor parameters to super().",
        interview: "In a subclass constructor, this is uninitialized until super() runs and delegates creation to the parent class. extends links subclass.prototype to parentclass.prototype.",
        diagram: `Dog instance ──▶ Dog.prototype ──▶ Animal.prototype ──▶ Object.prototype
super() is called -> Animal constructor creates and initializes the 'this' instance`,
        traps: [
          "<code>super()</code> MUST be called before using <code>this</code> in a subclass constructor. In a DERIVED class, <code>this</code> doesn't exist yet until <code>super()</code> runs — the parent constructor is what actually creates it. This differs from base classes/old-style functions, where <code>new</code> creates <code>this</code> automatically before any code runs.",
          "<code>super(args)</code> needs the SAME arguments the parent constructor expects — skipping needed args silently leaves the parent's this-properties as undefined.",
          "<code>super()</code> (calls parent constructor, only valid inside a subclass constructor) vs <code>super.methodName()</code> (calls a specific parent method, valid inside any subclass method) — easy to conflate, they do different things.",
          "Method overriding: if Dog.walk() doesn't call super.walk(), Animal's walk() is fully REPLACED, not extended — JS finds walk on Dog.prototype first (closer in the chain) and never looks further up unless you explicitly call super.walk()."
        ],
        interviewQ: "Why must super() be called before you can use this in a subclass constructor — what's actually happening differently compared to old-style constructor functions?"
      },
      {
        id: "freeze-seal",
        title: "Object.freeze/seal, property descriptors",
        status: "done",
        analogy: "Object.seal is like a locked filing cabinet — you can't add or remove drawers, but you can edit files inside existing drawers. Object.freeze is like a locked filing cabinet with all files laminated and glued down — you can't add, remove, or edit anything.",
        core: "Every JS property has descriptors: value, writable, configurable, and enumerable. Object.seal sets configurable:false on all own properties. Object.freeze sets configurable:false AND writable:false. Both operate shallowly and fail silently in non-strict mode.",
        code: `const user = { name: "Marwa", address: { city: "Giza" } };
Object.freeze(user);

user.name = "Changed"; // Silently fails (or throws in strict)
user.address.city = "Cairo"; // Mutates! Shallow freeze only.

function deepFreeze(obj) {
  Object.values(obj).forEach(val => {
    if (typeof val === 'object' && val !== null) deepFreeze(val);
  });
  return Object.freeze(obj);
}`,
        mistake: "Assuming Object.freeze is deep or throws errors in non-strict mode. Modifying frozen nested objects works fine, and modifying top-level frozen properties fails silently without warning in normal script execution.",
        interview: "Object.freeze blocks all modifications, while Object.seal permits editing existing property values. Both modify descriptor flags (writable/configurable) shallowly. Nested objects require recursive deep-freezing.",
        diagram: `user (FROZEN) ──address (ref pointer)──▶ address (MUTABLE)
┌────────────────────────────┐           ┌────────────────────┐
│ name: "Marwa"              │           │ city: "Giza"       │
│   writable: false          │           │   writable: true   │
│   configurable: false      │           │   configurable: true│
└────────────────────────────┘           └────────────────────┘`,
        traps: [
          "<code>seal</code>: can EDIT existing properties, can't ADD/DELETE (<code>configurable:false</code> only). <code>freeze</code>: can't EDIT, ADD, or DELETE anything (<code>writable:false</code> AND <code>configurable:false</code>).",
          "Failed writes on a frozen/sealed object fail <b>silently</b> in non-strict mode — no error, just does nothing. Only throws a <code>TypeError</code> in strict mode (or automatically inside classes/ES modules). This is a real production bug source — code looks like it worked.",
          "<b>Object.freeze is SHALLOW.</b> <code>Object.freeze({address:{city:\"Giza\"}})</code> still lets <code>obj.address.city = \"Cairo\"</code> succeed — nested objects are untouched. Freezing <code>user</code> only locks the top-level <b>reference</b>, not what that reference points to. Fix: write a recursive <code>deepFreeze()</code>."
        ],
        interviewQ: "Why does Object.freeze fail to protect user.address.city from being changed, even though user itself is frozen? What would you need to do differently?"
      },
      {
        id: "static-members",
        title: "Static Methods & Properties",
        status: "done",
        analogy: "Think of a class as a factory building. Instance methods are tools each worker (instance) carries around individually. Static methods are tools bolted to the factory floor itself — you don't need to hire a worker to use them; you just walk up to the building and use them directly.",
        core: "Some functionality logically belongs to the class as a concept, not to any individual instance — utility functions, factory methods, counters tracking all instances, configuration constants. Static members let you attach that behavior directly to the class itself.",
        code: `class Animal {
  static count = 0; // static property — belongs to the class, not instances

  constructor(name) {
    this.name = name;
    Animal.count++; // accessed via the class, not \`this\`
  }

  static createFeral() { // static method — a factory method
    return new Animal("Feral Animal");
  }

  walk() {
    console.log(\`\${this.name} walks\`);
  }
}

const a = new Animal("Rex");
const b = new Animal("Milo");
console.log(Animal.count); // 2 — tracked at the class level

const feral = Animal.createFeral();
console.log(feral.name); // "Feral Animal"

// Critical: static members are NOT accessible on instances
console.log(a.count); // undefined
console.log(a.createFeral); // undefined`,
        mistake: `class Counter {
  static total = 0;
  increment() {
    total++; // ReferenceError! must be Counter.total or this.constructor.total
  }
}`,
        interview: "Static methods are attached directly to the class/constructor function object — Animal.createFeral, not Animal.prototype.createFeral. Instance property lookup only walks the prototype chain (a.__proto__ → Animal.prototype → Object.prototype) — it never looks at properties sitting on the constructor function itself. Since createFeral was never placed on Animal.prototype, it's simply not reachable from a at all. a.createFeral resolves to undefined, and calling undefined() throws the TypeError.",
        diagram: `Animal (constructor function)
  ├── static count = 0        ← lives HERE, directly on Animal
  ├── static createFeral()    ← lives HERE too
  └── prototype
        └── walk()             ← instance methods live here, inherited by instances`,
        traps: [
          "Static members live directly on the <b>constructor function itself</b> (<code>Animal.count</code>), NOT on <code>Animal.prototype</code>. Instance property lookup only ever walks the <b>prototype chain</b> — it never checks the constructor function object — so instances literally cannot see static members.",
          "<code>a.createFeral</code> is <code>undefined</code>, not because it's \"hidden,\" but because it was never placed anywhere in <code>a</code>'s lookup path at all.",
          "Inside an instance method, referencing a static property by its bare name (<code>total++</code>) throws a <code>ReferenceError</code> — must use <code>ClassName.total</code> or <code>this.constructor.total</code> (the latter also correctly works in subclasses)."
        ],
        interviewQ: "Why does a.createFeral() fail with TypeError even though Animal.createFeral() works fine — where do static methods live and why can't instances see them?"
      },
      {
        id: "getters-setters",
        title: "Getters & Setters",
        status: "done",
        analogy: "Think of a getter/setter like a vending machine's front panel — you press a button (access a property normally, obj.price) but behind the panel, real logic runs (calculations, validation, logging) before you get your result. From the outside, it looks like plain property access — no parentheses, no method call syntax — but real code executes underneath.",
        core: "Sometimes you want a property to be computed on the fly, or you want to validate/transform a value whenever it's set — without forcing everyone using your object to remember to call getPrice()/setPrice() methods. Getters/setters let you keep the clean obj.property syntax while still running custom logic.",
        code: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {                    // getter — accessed WITHOUT parentheses
    return this.width * this.height;
  }

  set area(value) {                // setter — assigned WITHOUT parentheses, like a normal property
    console.log("Adjusting width to match desired area");
    this.width = value / this.height;
  }
}

const rect = new Rectangle(4, 5);
console.log(rect.area); // 20 — looks like a property, but actually RUNS the getter function

rect.area = 50; // looks like a normal assignment, but actually RUNS the setter function
console.log(rect.width); // 10 — width was recalculated by the setter`,
        mistake: `class Bad {
  get name() {
    return this.name; // INFINITE RECURSION! calling this.name inside the getter calls the getter again
  }
}`,
        interview: "The getter and the property it returns can't share the same name, because get name() doesn't create storage — it creates a function that runs on every access. Returning this.name inside it just re-triggers the same getter infinitely, since this.name is still resolved through that same getter, not a stored value. Need a separately-named backing field (usually a private #field) for the getter to actually read from.",
        diagram: `Object.getOwnPropertyDescriptor(Rectangle.prototype, 'area'):
{
  get: [Function: get area],
  set: [Function: set area],
  enumerable: false,
  configurable: true
}
// NO 'value' or 'writable' key at all — replacing them with get/set accessors`,
        traps: [
          "Getters/setters look like plain property access (no parentheses) but actually RUN a function underneath — <code>rect.area</code> executes <code>get area()</code>, <code>rect.area = 50</code> executes <code>set area(value)</code>.",
          "<b>Classic infinite recursion trap:</b> <code>get name(){ return this.name; }</code> — reading <code>this.name</code> inside the getter re-triggers the SAME getter, forever, until <code>RangeError: Maximum call stack size exceeded</code>. The getter name and the value it returns can never be the same property — there's no hidden storage just because you used that word.",
          "Fix: use a differently-named backing field for real storage — ideally a private <code>#field</code>, not just an <code>_underscore</code> convention. <code>get name(){ return this.#name; }</code> works because <code>#name</code> is a genuinely separate property.",
          "Under the hood, getter/setter property descriptors have <code>get</code>/<code>set</code> function references instead of a <code>value</code> key — structurally different from normal data properties."
        ],
        interviewQ: "Why does get name(){ return this.name; } cause an infinite loop / stack overflow — what's happening on each recursive call?"
      },
      {
        id: "private-fields",
        title: "Private Class Fields (#field)",
        status: "done",
        analogy: "Think of private fields (#) like a house with a locked high-security vault inside. Normal rooms are public properties (anyone inside can see or open them), but the vault requires biometric access — only internal class methods can touch it, and it's completely inaccessible to the outside world, with no backdoors.",
        core: "Before #privateField syntax (ES2022), JS had no true privacy at the language level. Developers faked it with naming conventions (_email) — but that's just a social contract; nothing actually stops external code from reading or mutating user._email directly. # fields are enforced by the JS engine itself — not a convention, a hard language-level guarantee.",
        code: `class User {
  #email;         // private field — declared with #, must be declared in the class body
  #loginAttempts = 0; // private fields can have default values too

  constructor(email) {
    this.#email = email;
  }

  #logAttempt() {  // private METHODS too — not just fields
    this.#loginAttempts++;
  }

  login(password) {
    this.#logAttempt();
    console.log(\`Attempt #\${this.#loginAttempts}\`);
  }
}

const u = new User("marwa@example.com");
u.login("pw123"); // "Attempt #1"

console.log(u.email);       // undefined — no public property with that name exists
console.log(Object.keys(u)); // [] — private fields don't even show up in enumeration
// console.log(u.#email);   // SyntaxError — parser prevents referencing from outside`,
        mistake: `class Admin extends User {
  checkEmail() {
    console.log(this.#email); // SyntaxError! Private fields are NOT inherited/accessible in subclasses
  }
}`,
        interview: "_email is enforcement by convention only — it's a completely ordinary public property, and the underscore is just a human signal with no effect on the engine. #email is enforcement by the language grammar itself — #fieldName syntax is only legal inside a class body, so accessing it from outside isn't a runtime permission check that could be bypassed, it's a parse-time SyntaxError. The code literally doesn't compile. That's the real distinction: convention-based privacy can always be violated by anyone with the reference; syntax-based privacy can't be violated at all, because the access path doesn't exist as valid code outside the class.",
        diagram: `Outside Class Scope:
  u.#email  ──▶ Parsing stage checks grammar ──▶ Throws parse-time SyntaxError
Inside Class Scope:
  this.#email ──▶ Lexical binding resolved ──▶ Reads/writes private state`,
        traps: [
          "<code>_email</code> (underscore) is <b>fake privacy</b> — a completely ordinary public property with a naming convention that means nothing to the engine. <code>#email</code> is <b>real privacy</b> — enforced by the parser itself.",
          "The mechanism differs fundamentally: <code>_email</code> access is a <b>runtime-bypassable convention</b> (anyone with the reference can read/write it). <code>#email</code> access from outside a class is a <b>parse-time SyntaxError</b> — the code doesn't even compile, it's not a permission check that could be bypassed.",
          "Private fields don't show up in <code>Object.keys()</code>, <code>for...in</code>, <code>JSON.stringify</code>, or bracket notation — they're not stored like normal properties at all.",
          "Private fields are NOT inherited/accessible in subclasses — <code>this.#email</code> inside a subclass throws a SyntaxError even if the subclass extends the class that declared it. A subclass needing access requires the base class to expose a protected getter/method."
        ],
        interviewQ: "Why is #email outside a class body a SyntaxError, but user._email from outside just silently works, even though both are 'meant' to be private?"
      },
      {
        id: "polymorphism",
        title: "Polymorphism",
        status: "done",
        analogy: "Think of a universal remote control — pressing 'power' does something different depending on which device it's pointed at (TV turns on differently than a soundbar), but you use the same button, same interface, regardless of the device. Polymorphism means different classes can respond to the same method call in their own specific way.",
        core: "Without polymorphism, code that works with multiple related types would need explicit if/else or switch checks for every type. Polymorphism lets you write code that calls one method name and trusts each object to handle it correctly for its own type — dramatically reducing conditional branching.",
        code: `class Animal {
  speak() {
    console.log("Some generic animal sound");
  }
}

class Dog extends Animal {
  speak() {          // overrides Animal's speak
    console.log("Woof!");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Meow!");
  }
}

const animals = [new Animal(), new Dog(), new Cat()];
animals.forEach(animal => animal.speak());
// "Some generic animal sound"
// "Woof!"
// "Meow!"`,
        mistake: "Assuming that inheritance is mandatory for polymorphism in JavaScript, or that removing extends will break polymorphic function calls.",
        interview: "No, a shared base class is just a convenience for organizing/sharing common logic — not required. Removing extends Animal from both still lets animals.forEach(a => a.speak()) work identically, as long as each object has its own .speak() method. JS resolves the call by checking whether the method exists, not whether the object descends from a particular class — that's duck typing.",
        diagram: `animal.speak() lookup path at runtime:
  instance (Dog) ──▶ Dog.prototype (speak() found: Woof!) ──▶ stop
  instance (Cat) ──▶ Cat.prototype (speak() found: Meow!) ──▶ stop
  instance (Animal) ──▶ Animal.prototype (speak() found: Generic sound)`,
        traps: [
          "Polymorphism in JS is NOT a separate mechanism — it's just the design benefit you get from <b>method overriding via the prototype chain</b> (same one from Topic 20). Different subclasses' overridden methods sit closer in the chain, so they're found before the parent's version.",
          "JS does <b>NOT</b> require a shared base class for polymorphism to work. If <code>[dog, robot].forEach(x =&gt; x.speak())</code> — and <code>robot</code> isn't even an <code>Animal</code> — it still works fine as long as <code>robot</code> has its own <code>.speak()</code> method. This is <b>duck typing</b>: JS checks \"does this object have the method,\" not \"does it descend from a particular class.\"",
          "Removing <code>extends Animal</code> from Dog/Cat changes NOTHING about whether polymorphism works — inheritance is a convenience for sharing code, not a requirement for polymorphic behavior in JS."
        ],
        interviewQ: "Does JS need Dog and Cat to share a common base class (Animal) for polymorphism to work, or is that just a convenience? What happens if you remove extends Animal from both?"
      },
      {
        id: "composition-inheritance",
        title: "Composition vs. Inheritance",
        status: "done",
        analogy: "Inheritance is like a family tree — you get a fixed set of traits handed down from one lineage, whether you need all of them or not. Composition is like assembling a toolkit — you pick and attach only the specific capabilities you actually need, from wherever they come from, without being locked into one ancestry.",
        core: "extends feels natural at first, but it creates a rigid, single-lineage hierarchy — and real-world requirements rarely fit neatly into one strict 'is-a' relationship. This leads to the famous 'fragile base class' problem where changing a grandparent class unpredictably breaks every descendant.",
        code: `const canFly = {
  fly() { console.log(\`\${this.name} is flying\`); }
};
const canSwim = {
  swim() { console.log(\`\${this.name} is swimming\`); }
};

function createDuck(name) {
  return Object.assign({ name }, canFly, canSwim); // composes capabilities directly
}
function createPenguin(name) {
  return Object.assign({ name }, canSwim); // only gets what it actually needs — no fly()
}

const duck = createDuck("Donald");
duck.fly();  // "Donald is flying"
duck.swim(); // "Donald is swimming"

const penguin = createPenguin("Pingu");
penguin.swim(); // "Pingu is swimming"
// penguin.fly(); // TypeError: penguin.fly is not a function`,
        mistake: `class Bird {
  fly() { console.log("Flying"); }
}
class Penguin extends Bird {
  fly() { throw new Error("Penguins can't fly!"); } // awkward override
}`,
        interview: "Inheritance forces all-or-nothing capability bundling — a subclass gets every parent method whether it fits or not, so exceptions like a flightless bird require overriding fly() to throw an error, which breaks the uniform interface polymorphism relies on. Composition never makes that bundling promise — capabilities are explicitly assembled only when needed, so a penguin never has fly() in the first place. It's not a special case being suppressed, it's simply never granted — which is why it's a structural fix, not a workaround.",
        diagram: `Inheritance (rigid taxonomies):
  Bird (fly) ──▶ Penguin (fly: throws Error) -- violation of Liskov Substitution
Composition (flexible capability assembly):
  swimBehavior ──┐
                 ├──▶ Penguin { name, swim } (no fly method)
  flyBehavior  ──┘`,
        traps: [
          "<b>The structural problem with inheritance:</b> it forces an all-or-nothing bundle — a subclass gets EVERY parent method whether it fits or not. Classic trap: <code>Penguin extends Bird</code> where <code>Bird</code> has <code>fly()</code> — penguin is forced to either inherit a broken capability or override it to throw an error, which breaks the uniform interface polymorphism relies on.",
          "Composition avoids this <b>structurally, not by luck</b> — it never makes the \"you get everything\" promise in the first place. A composed penguin object simply never has <code>fly</code> mixed in — its absence isn't a special case being suppressed, it was just never granted.",
          "Classes can only <code>extends</code> ONE parent (no multiple inheritance in JS) — <b>mixins</b> (functions that take a base class and return an extended class) are the structured workaround for composing multiple independent behaviors while still using class syntax.",
          "The industry principle is \"<b>favor</b> composition over inheritance,\" not \"never use inheritance\" — extends is still right for genuine, stable \"is-a\" relationships with no expected exceptions; composition is right for \"has-a\"/\"can-do\" mixable capabilities."
        ],
        interviewQ: "In the Penguin/Bird example — what specifically goes wrong with using inheritance, and why does composition avoid that problem structurally, not just by coincidence?"
      }
    ]
  }
);
