CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    image_path TEXT,
    anonymous_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ
);


CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    anonymous_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (post_id, anonymous_id)
);


CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    anonymous_id UUID NOT NULL,
    content TEXT NOT NULL,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE comment_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    comment_id UUID NOT NULL
        REFERENCES comments(id)
        ON DELETE CASCADE,

    anonymous_id UUID NOT NULL,

    content TEXT NOT NULL,

    deleted BOOLEAN NOT NULL DEFAULT false,

    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

     post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);