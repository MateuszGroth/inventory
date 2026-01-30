type ObjectValues<T> = T[keyof T]

type ListValues<T extends ReadonlyArray<unknown> | Array<unknown>> = T[number]

type Prettify<T extends object> = { [K in keyof T]: T[K] } & {}

type DistributiveOmit<T, K extends string | number | symbol> = T extends T ? Omit<T, K> : never

type StringKeys<TR extends object> = {
  [K in keyof TR]: K extends string ? K : never
}[keyof TR]
