import org.gradle.internal.os.OperatingSystem
plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.allopen") version "1.9.22"
    kotlin("plugin.noarg") version "1.9.22"
    war
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.9.24"))
    implementation(kotlin("reflect"))
    implementation(kotlin("stdlib"))

    compileOnly("jakarta.platform:jakarta.jakartaee-api:10.0.0")

    implementation("org.eclipse.persistence:org.eclipse.persistence.jpa:4.0.3")
    implementation("com.h2database:h2:2.2.224")

    testImplementation(kotlin("test"))
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")

    annotation("jakarta.ejb.Stateless")
    annotation("jakarta.ejb.Singleton")
}

noArg {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

tasks.test {
    useJUnitPlatform()
}

tasks.war {
    archiveFileName.set("webLab4.war")
}

tasks.register<Exec>("npmInstall") {
    workingDir = frontendDir
    commandLine = npmCommand("install")
}

tasks.register<Exec>("npmBuild") {
    workingDir = frontendDir
    commandLine = npmCommand("run", "build")
    dependsOn("npmInstall")
}

tasks.named("war") {
    dependsOn("npmBuild")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

kotlin {
    jvmToolchain(17)
}

val frontendDir = file("frontend")

fun npmCommand(vararg args: String): List<String> {
    val os = OperatingSystem.current()
    return if (os.isWindows) listOf("cmd", "/c", "npm", *args) else listOf("npm", *args)
}

