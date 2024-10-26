type Constructor<T = any> = new (...args: any[]) => T;

export class DependencyService {
  private dependencies: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  register<T>(
    token: string,
    dependency: Constructor<T> | T,
    isSingleton: boolean = false
  ): void {
    const normalizedToken = token.toLowerCase();
    this.dependencies.set(normalizedToken, { dependency, isSingleton });
  }

  resolve<T>(token: string): T {
    const normalizedToken = token.toLowerCase();
    const dependencyInfo = this.dependencies.get(normalizedToken);

    if (!dependencyInfo) {
      throw new Error(`Dependency ${token} not found`);
    }

    const { dependency, isSingleton } = dependencyInfo;

    if (isSingleton) {
      let instance = this.singletons.get(normalizedToken);
      if (!instance) {
        instance = this.createInstance(dependency);
        this.singletons.set(normalizedToken, instance);
      }
      return instance as T;
    }

    return this.createInstance(dependency);
  }

  private createInstance<T>(dependency: Constructor<T> | T): T {
    if (typeof dependency === "function") {
      const constructor = dependency as Constructor<T>;
      const params = this.getConstructorParams(constructor);
      const resolvedParams = params.map((param) => this.resolve(param));
      return new constructor(...resolvedParams);
    }

    return dependency as T;
  }

  private getConstructorParams(constructor: Constructor): string[] {
    const paramNames =
      constructor
        .toString()
        .match(/constructor\s*\(([\s\S]*?)\)/)?.[1]
        .split(",")
        .map((param) => param.trim())
        .filter((param) => param) || [];

    return paramNames.map((param) => {
      const name = param.split(":")[0].trim();
      return name.charAt(0).toUpperCase() + name.slice(1);
    });
  }
}
