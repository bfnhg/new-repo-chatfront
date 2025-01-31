import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

const permissions = [
  {
    subject: 'dashboard',
    Admin: ['read', 'create', 'update']
  },
  {
    subject: 'dashboardAdmin',
    Admin: ['read', 'create', 'update']
  },
  {
    subject: 'chatbot',
    Admin: ['read', 'create', 'update']
  },
  {
    subject: 'client',
    Admin: ['read', 'create', 'update']
  },
  {
    subject: 'dashboardClient',
    client: ['read', 'create', 'update']
  },

  {
    subject: 'conversationHistoric',
    client: ['read', 'create', 'update']
  },
  {
    subject: 'Assistanceassocier',
    client: ['read', 'create', 'update']
  },
  {
    subject: 'gestionchatbotassistant',
    Admin: ['read', 'create', 'update']
  }

  // Ajoutez d'autres sujets et rôles ici si nécessaire
]

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */

const defineRulesFor = (role, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  if (role === 'admin') {
    can('manage', ['dashboard', 'client', 'gestionchatbotassistant'])
  } else if (role === 'client') {
    // can(['read'], 'acl-page')
    can('manage', ['dashboardClient', 'chatbot', 'conversationHistoric', 'Assistanceassocier'])
  } else {
    // can(['read', 'create', 'update', 'delete'], subject)
    // can('manage', 'all')

    permissions.forEach(rule => {
      if (rule[role]) {
        can(rule[role], rule.subject)
      }
    })
  }

  return rules
}

export const buildAbilityFor = (role, subject) => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
