# https://github.com/LukeMathWalker/cargo-chef
# https://github.com/napi-rs/package-template/blob/0e2b015e97aa8b9aac9cdad5b8e2e375273f0981/.github/workflows/CI.yml#L48

#
# stage_cargo_chef
#

FROM ghcr.io/napi-rs/napi-rs/nodejs-rust:lts-debian as stage_cargo_chef

WORKDIR app
RUN cargo install cargo-chef@0.1.45
RUN npm install -g pnpm@7

#
# stage_cargo_chef -> stage_prepare
#

FROM stage_cargo_chef as stage_prepare

COPY ./ ./
RUN cargo chef prepare --recipe-path recipe.json

#
# stage_cargo_chef -> stage_build
#

FROM stage_cargo_chef as stage_build

COPY --from=stage_prepare /app/recipe.json ./
RUN cargo chef cook --release --recipe-path recipe.json

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

COPY ./ ./
RUN npm run napi
