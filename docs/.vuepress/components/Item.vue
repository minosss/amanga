<template>
	<div>
        <p>
            首页: <a :href="home" target="_blank">{{ home }}</a>
        </p>
		<p>
            例子: <code>{{ example }}</code>
        </p>
	</div>
</template>

<script>
export default {
	props: {
		example: {
			type: String,
			required: true,
		},
		home: {
			type: String,
			required: true,
		},
	},
};
</script>
